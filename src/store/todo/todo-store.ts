import { TodoUserType } from "@/@types/todo-user-type";
import { create } from "zustand";

interface State {
  openDialogUpdate: boolean;
  openDialogCreate: boolean;
  todo: TodoUserType | null;
  openDialogRemove: boolean;
  openDialogDetails: boolean;
}

interface Actions {
  setOpenDialogUpdate: (openDrawer: boolean) => void;
  setOpenDialogCreate: (openDrawer: boolean) => void;
  setOpenDialogRemove: (openDrawer: boolean) => void;
  setOpenDialogDetails: (openDrawer: boolean) => void;
  setTodo: (todo: TodoUserType | null) => void;
}

const useDialogTodoState = create<State & Actions>((set) => ({
  openDialogUpdate: false,
  setOpenDialogUpdate: (by: boolean) =>
    set(() => ({
      openDialogUpdate: by,
    })),

  openDialogDetails: false,
  setOpenDialogDetails: (by: boolean) =>
    set(() => ({
      openDialogDetails: by,
    })),

  openDialogCreate: false,
  setOpenDialogCreate: (by: boolean) =>
    set(() => ({
      openDialogCreate: by,
    })),
  todo: null,
  setTodo: (todo: TodoUserType | null) =>
    set(() => ({
      todo,
    })),

  openDialogRemove: false,
  setOpenDialogRemove: (by: boolean) =>
    set(() => ({
      openDialogRemove: by,
    })),
}));

export default useDialogTodoState;
