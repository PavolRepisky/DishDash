import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Reservation } from "../../donor/types/Reservation";

const updateReservation = async (reservation: Reservation): Promise<Reservation> => {
  const { data } = await axios.put("/api/reservations", reservation);
  return data;
};

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateReservation, {
    onSuccess: (reservation: Reservation) => {
      queryClient.setQueryData<Reservation[]>(["reservations"], (oldReservations) =>
        updateOne(oldReservations, reservation)
      );
    },
  });

  return { isUpdating: isLoading, updateReservation: mutateAsync };
}
