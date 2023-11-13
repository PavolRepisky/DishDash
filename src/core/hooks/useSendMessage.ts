import axios from "axios";
import { useMutation } from "react-query";

const sendMessage = async (data: {
  email: string;
  message: string;
}): Promise<void> => {
  await axios.post("/api/message", data);
};

export function useSendMessage() {
  const { isLoading, mutateAsync } = useMutation(sendMessage);
  return { isSending: isLoading, sendMessage: mutateAsync };
}
