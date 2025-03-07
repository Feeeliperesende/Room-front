import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";

import { useForm, SubmitHandler, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "../../../lib/utils";
import { TodoUserType } from "@/@types/todo-user-type";
import { updateTodo } from "@/http/queries/todo/mutation/update-mutation";
import { FilteredTodosKey } from "@/http/queries/todo/mutation/list-details";
import { toast } from "sonner";
import { SelectForm } from "@/components/ui/select-form";

type updateTodoType = {
  name: string;
  description: string;
  date: string;
  status: "AWAITING" | "FINISHED" | "CANCELED";
};

const statusData = [
  {
    id: "AWAITING",
    name: "Aguardando",
  },
  {
    id: "FINISHED",
    name: "Finalizado",
  },
  {
    id: "CANCELED",
    name: "Cancelado",
  },
];

const schema = z.object({
  name: z.string().min(1, { message: "Informe o nome" }),
  description: z.string().min(1, { message: "Informe a descrição" }),
  date: z.string().date(),
  status: z.enum(["AWAITING", "FINISHED", "CANCELED"]),
});

interface DialogRoomProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  todo: TodoUserType | null;
  user_id: string;
}

const DialogUpdateTodo = ({
  open,
  setOpen,
  todo,
  user_id,
}: DialogRoomProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<updateTodoType>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const client = useQueryClient();

  useEffect(() => {
    setValue("name", todo?.name || "");
    setValue("description", todo?.description || "");
    setValue("status", todo?.status || "AWAITING");
    setValue("date", todo?.date || "");
  }, [todo, setValue]);

  const EditTodo = useMutation({
    mutationFn: (data: updateTodoType) => updateTodo(todo?.id, data),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: FilteredTodosKey(user_id),
        refetchType: "all",
      });

      setOpen(!open);

      toast.success("Atividade alterada com sucesso!");
      reset();
    },
    onError: () => {
      toast.error("Erro ao alterar atividade");
      setOpen(!open);
    },
  });

  const onSubmit: SubmitHandler<updateTodoType> = async (
    data: updateTodoType
  ) => {
    EditTodo.mutate({
      name: data.name,
      date: data.date,
      description: data.description,
      status: data.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} key="update">
      <DialogContent
        aria-describedby="update"
        className={cn(
          "m-5 w-2/3 bg-white md:rounded-lg  md:h-[450px]  h-[550px] flex flex-col overflow-y-auto md:min-w-[500px]"
        )}
      >
        <DialogHeader>
          <DialogTitle>Editar atividade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5"></div>

          <div className="flex flex-col md:flex-row  gap-5 w-full items-center justify-center">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                placeholder="nome"
                {...register("name")}
                className="rounded-[7px] h-[45px]"
              />

              {errors?.name && (
                <p className="text-red-300 text-[13px]">
                  {errors?.name?.message}
                </p>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <SelectForm
                  control={control as unknown as Control}
                  name="status"
                  data={statusData}
                  placeholder="Selecione um status"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row  gap-5 w-full  mt-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                placeholder="Data"
                {...register("date")}
                className="rounded-[7px]  h-[45px]"
                type="date"
              />

              {errors?.date && (
                <p className="text-red-300 text-[13px]">
                  {errors?.date?.message}
                </p>
              )}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <textarea
                {...register("description")}
                placeholder="Descrição"
                className="w-full h-[100px] rounded-[7px] resize-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />

              {errors?.description && (
                <p className="text-red-300 text-[13px]">
                  {errors?.description?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex fixed bottom-5 right-5 gap-5">
            <Button
              variant={"outline"}
              className="border-[1px] border-red-500 rounded-[5px] hover:text-red-500 text-red-500 w-[120px] h-[40px] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              Limpar
            </Button>
            <Button
              disabled={EditTodo?.isPending}
              variant={"outline"}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-[5px] hover:text-white text-white w-[120px] h-[40px] cursor-pointer"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default DialogUpdateTodo;
