import { TodoUserType } from "@/@types/todo-user-type";
import http from "@/http/http";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export async function listTodos(ctx: QueryFunctionContext) {
  const [, id] = ctx.queryKey as [key: string, id: string | undefined];

  const list: TodoUserType[] = await http
    .get<TodoUserType[]>(`todo/user/${id}`)
    .then((r) => r.data)
    .catch((e) => {
      console.log(JSON.stringify(e));
      throw e;
    });

  return list;
}

export const FilteredTodosKey = (id: string | undefined) => [
  "LIST_TODOS_BY_USER",
  id,
];

export const useListTodos = (id: string | undefined) => {
  return useQuery({
    queryFn: listTodos,
    enabled: !!id,
    queryKey: FilteredTodosKey(id),
  });
};
