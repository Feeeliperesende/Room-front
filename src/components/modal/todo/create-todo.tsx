import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "../../../lib/utils";

import { createTodo } from "@/http/queries/todo/mutation/create-mutation";
import { FilteredTodosKey } from "@/http/queries/todo/mutation/list-details";
import { toast } from "sonner";

type createTodoType = {
  name: string;
  description: string;
  date: string;
};

const schema = z.object({
  name: z.string().min(1, { message: "Informe o nome" }),
  description: z.string().min(1, { message: "Informe a descrição" }),
  date: z.string().date(),
});

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user_id: string;
}

const DialogCreateTodo = ({ open, setOpen, user_id }: DialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createTodoType>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const client = useQueryClient();

  const addToy = useMutation({
    mutationFn: (data: createTodoType) => createTodo(data, user_id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: FilteredTodosKey(user_id),
        refetchType: "all",
      });

      setOpen(!open);
      toast.success("Atividade adicionada com sucesso!");

      reset();
    },
    onError: () => {
      toast.error("Erro ao adicionar atividade.");

      setOpen(!open);
    },
  });

  const onSubmit: SubmitHandler<createTodoType> = async (
    data: createTodoType
  ) => {
    addToy.mutate({
      name: data.name,
      date: data.date,
      description: data.description,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby="create"
        className={cn(
          "m-5 w-2/3 bg-white md:rounded-lg  md:h-[450px]  h-[450px] flex flex-col overflow-y-auto md:min-w-[500px]"
        )}
      >
        <DialogHeader>
          <DialogTitle>Adicionar nova atividade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-col md:flex-row  gap-5 w-full items-center justify-center ">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  placeholder="nome"
                  {...register("name")}
                  className="rounded-[7px] h-[45px] w-full"
                />

                {errors?.name && (
                  <p className="text-red-300 text-[13px]">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row  gap-5 w-full items-center justify-center mt-4">
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
            </div>

            <div className="flex flex-col md:flex-row  gap-5 w-full flex-1 mt-4 items-center justify-center">
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
          </div>

          <div className="flex fixed bottom-5 right-5 gap-5">
            <DialogFooter>
              <Button
                variant={"outline"}
                className="border-[1px] border-red-500 rounded-[5px] hover:text-red-500 text-red-500 w-[120px] h-[40px] cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Limpar
              </Button>
              <Button
                disabled={addToy?.isPending}
                variant={"outline"}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-[5px] hover:text-white text-white w-[120px] h-[40px] cursor-pointer"
                type="submit"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default DialogCreateTodo;
