import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "../../../lib/utils";
import { TodoUserType } from "@/@types/todo-user-type";
import { FilteredTodosKey } from "@/http/queries/todo/mutation/list-details";
import { removeTodo } from "@/http/queries/todo/mutation/remove-mutation";
import { toast } from "sonner";

type removeTodoType = {
  name: string;
};

const schema = z.object({
  name: z.string().min(1, { message: "Informe o nome" }),
});

interface DialogRoomProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  todo: TodoUserType | null;
  user_id: string;
}

const DialogRemoveTodo = ({
  open,
  todo,
  user_id,
  setOpen,
}: DialogRoomProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<removeTodoType>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const client = useQueryClient();

  useEffect(() => {
    setValue("name", todo?.name || "");
  }, [todo, setValue]);

  const RemoveToy = useMutation({
    mutationFn: () => removeTodo(todo?.id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: FilteredTodosKey(user_id),
        refetchType: "all",
      });

      setOpen(!open);

      toast.success("Atividade removida com sucesso!");
      reset();
    },
    onError: () => {
      toast.error("Erro ao remover atividade");
      setOpen(!open);
    },
  });

  const onSubmit: SubmitHandler<removeTodoType> = async () => {
    RemoveToy.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} key="remove">
      <DialogContent
        aria-describedby="remove"
        className={cn(
          "m-5 w-2/3 bg-white md:rounded-lg  md:h-[300px]  h-[300px] flex flex-col overflow-y-auto md:min-w-[500px]"
        )}
      >
        <DialogHeader>
          <DialogTitle>Remover atividade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row  gap-5 w-full ">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  placeholder="nome"
                  {...register("name")}
                  className="rounded-[7px] h-[45px]"
                  disabled
                />

                {errors?.name && (
                  <p className="text-red-300 text-[13px]">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
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
              Cancelar
            </Button>
            <Button
              disabled={RemoveToy?.isPending}
              variant={"outline"}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-[5px] hover:text-white text-white w-[120px] h-[40px] cursor-pointer"
              type="submit"
            >
              Remover
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default DialogRemoveTodo;
