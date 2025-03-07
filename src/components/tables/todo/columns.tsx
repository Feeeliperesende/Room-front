import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { format, parseISO } from "date-fns";
import useDialogTodoState from "../../../store/todo/todo-store";

import { ptBR } from "date-fns/locale";
import { TodoUserType } from "@/@types/todo-user-type";

const todoUpdateManager = useDialogTodoState.getState().setOpenDialogUpdate;
const drawerIsOpen = useDialogTodoState.getState().openDialogUpdate;
const todoStateManager = useDialogTodoState.getState().setTodo;
const todoRemoveManager = useDialogTodoState.getState().setOpenDialogRemove;
const todoRemoveIsOpen = useDialogTodoState.getState().openDialogRemove;

const TODO_STATUS = {
  AWAITING: "AWAITING",
  FINISHED: "FINISHED",
  CANCELED: "CANCELED",
} as const;

const STATUS_CONFIG = {
  [TODO_STATUS.AWAITING]: {
    label: "Aguardando",
    bgColor: "bg-blue-500",
  },
  [TODO_STATUS.FINISHED]: {
    label: "Finalizado",
    bgColor: "bg-emerald-500",
  },
  [TODO_STATUS.CANCELED]: {
    label: "Cancelado",
    bgColor: "bg-red-500",
  },
} as const;

const StatusBadge = ({ status }: { status: keyof typeof STATUS_CONFIG }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div
      className={`w-[120px] h-[30px] rounded-sm ${config.bgColor} flex items-center justify-center`}
    >
      <p className="text-white">{config.label}</p>
    </div>
  );
};

export const columnsTodos: ColumnDef<TodoUserType>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "date",
    header: "Data de criação",
    cell: ({ row }) => {
      const { date } = row.original;
      return <p>{format(parseISO(date), "dd/MM/yyyy", { locale: ptBR })}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return <StatusBadge status={status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              aria-label="Abrir menu de ações"
            >
              <MoreHorizontal className="h-4 w-4 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Informações</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                todoUpdateManager(!drawerIsOpen);
                todoStateManager(row.original);
              }}
            >
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                todoRemoveManager(!todoRemoveIsOpen);
                todoStateManager(row.original);
              }}
            >
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
