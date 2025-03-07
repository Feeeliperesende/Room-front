import http from "@/http/http";

export const removeTodo = async (id: string | undefined) => {
  await http.delete(`/todo/${id}`).catch((error) => {
    console.error(error);
    throw error;
  });
};
