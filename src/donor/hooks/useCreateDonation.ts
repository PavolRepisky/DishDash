import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Donation } from "../types/Donation";

const createDonation = async (donation: Donation): Promise<Donation> => {
  const { data } = await axios.post("/api/donations", donation);
  return data;
};

export function useCreateDonation() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createDonation, {
    onSuccess: (donation: Donation) => {
      queryClient.setQueryData<Donation[]>(["donations"], (oldDonations) =>
        addOne(oldDonations, donation)
      );
    },
  });

  return { isCreating: isLoading, createDonation: mutateAsync };
}
