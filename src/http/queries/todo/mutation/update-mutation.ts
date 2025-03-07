import http from "@/http/http";

interface updateTodoType {
  name: string;
  description: string;
  date: string;
  status: "AWAITING" | "FINISHED" | "CANCELED";
}

export const updateTodo = async (
  id: string | undefined,
  data: updateTodoType
) => {
  await http
    .patch(`/todo/${id}`, {
      ...data,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
