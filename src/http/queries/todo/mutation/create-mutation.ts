import http from "@/http/http";

interface createTodoType {
  name: string;
  description: string;
  date: string;
}

export const createTodo = async (data: createTodoType, user_id: string) => {
  await http
    .post(`/todo/create`, {
      ...data,
      user_id,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
