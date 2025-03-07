"use client";
import DialogCreateTodo from "@/components/modal/todo/create-todo";
import DialogUpdateTodo from "@/components/modal/todo/edit-todo";
import DialogRemoveTodo from "@/components/modal/todo/remove-todo";
import { SelectStatus } from "@/components/select-status";
import { columnsTodos } from "@/components/tables/todo/columns";
import { DataTableTodos } from "@/components/tables/todo/data-table";
import { Input } from "@/components/ui/input";
import { TodoContext, TodoContextTypes } from "@/contexts/user";
import { useListTodos } from "@/http/queries/todo/mutation/list-details";
import useDialogTodoState from "@/store/todo/todo-store";
import { CircleX, SquarePlus } from "lucide-react";
import React, { useContext } from "react";

const Activities = () => {
  const { userInfo } = useContext<TodoContextTypes>(TodoContext);
  const {
    openDialogCreate,
    setOpenDialogCreate,
    setOpenDialogUpdate,
    openDialogUpdate,
    todo,
    openDialogRemove,
    setOpenDialogRemove,
  } = useDialogTodoState();
  const [search, setSearch] = React.useState("");
  const [selectStatus, setSelectStatus] = React.useState<string>("");
  const { data: listTodos, isLoading } = useListTodos(userInfo?.id);

  const filteredTodos = React.useMemo(() => {
    if (!listTodos) return [];
    return listTodos.filter((todo) => {
      const matchesSearch = todo.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = selectStatus ? todo.status === selectStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [listTodos, search, selectStatus]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-2xl font-bold">Carregando...</span>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex flex-col md:flex-row gap-3  items-center justify-center mt-4">
            <Input
              placeholder="Buscar atividades"
              className="h-[45px] max-w-[50%] rounded-md "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex flex-row">
              <SelectStatus
                selectStatus={selectStatus}
                setSelectStatus={setSelectStatus}
              />
              {selectStatus && (
                <div
                  className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 h-[45px] w-[45px] rounded-md ml-2 cursor-pointer"
                  onClick={() => setSelectStatus("")}
                >
                  <CircleX size={24} className="text-white" />
                </div>
              )}
              <div
                className="flex items-center justify-center bg-indigo-700 hover:bg-indigo-800 h-[45px] w-[45px] rounded-md ml-2 cursor-pointer"
                onClick={() => setOpenDialogCreate(true)}
              >
                <SquarePlus size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div>
            <DataTableTodos
              columns={columnsTodos}
              data={listTodos ? filteredTodos : []}
            />
          </div>
        </>
      )}
      <DialogCreateTodo
        open={openDialogCreate}
        setOpen={setOpenDialogCreate}
        user_id={userInfo?.id as string}
      />

      <DialogUpdateTodo
        open={openDialogUpdate}
        setOpen={setOpenDialogUpdate}
        todo={todo}
        user_id={userInfo?.id as string}
      />

      <DialogRemoveTodo
        open={openDialogRemove}
        setOpen={setOpenDialogRemove}
        todo={todo}
        user_id={userInfo?.id as string}
      />
    </div>
  );
};

export default Activities;
