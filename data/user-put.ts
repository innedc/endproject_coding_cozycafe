import mutation from "./_mutation";
import useSWRMutation from "swr/mutation";
import { API_URL } from "@/constants/Api";

export default function useUserPut(id: string) {
  const { trigger, data, error, isMutating } = useSWRMutation(
    `${API_URL}/users/${id}`,
    async (url, { arg }: { arg: any }) => {
      try {
        const response = await mutation(url, {
          method: "PUT",
          body: arg,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        console.error("PUT request failed:", err);
        throw err;
      }
    }
  );

  return {
    data,
    isMutating,
    isError: !!error,
    trigger,
  };
}
