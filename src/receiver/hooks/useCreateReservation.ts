import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Reservation } from "../../donor/types/Reservation";

const createReservation = async (
  reservation: Reservation
): Promise<Reservation> => {
  const { data } = await axios.post("/api/reservations", reservation);
  return data;
};

export function useCreateReservation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createReservation, {
    onSuccess: (reservation: Reservation) => {
      queryClient.setQueryData<Reservation[]>(
        ["reservations"],
        (oldReservations) => addOne(oldReservations, reservation)
      );
    },
  });

  return { isCreating: isLoading, createReservation: mutateAsync };
}
