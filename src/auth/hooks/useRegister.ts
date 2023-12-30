import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { UserInfo } from "../types/userInfo";

const register = async (userInfo: UserInfo): Promise<UserInfo> => {
  const { data } = await axios.post("/api/register", userInfo);
  return data;
};

export function useRegister() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(register, {
    onSuccess: (user: UserInfo) => {
      queryClient.setQueryData<UserInfo[]>(["users"], (oldUsers) =>
        addOne(oldUsers, user)
      );
    },
  });

  return { isRegistering: isLoading, register: mutateAsync };
}
