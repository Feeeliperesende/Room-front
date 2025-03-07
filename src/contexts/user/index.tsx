"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { parseCookies } from "nookies";
import http from "@/http/http";
import { User, UserId } from "@/@types/user-id";

interface UserContextProps {
  children: ReactNode;
}

export interface TodoContextTypes {
  user: UserId | null;
  setUser: (user: UserId) => void;
  userInfo: User | null;
  setUserInfo: (user: User) => void;
}

export const TodoContext = createContext<TodoContextTypes>(
  {} as TodoContextTypes
);

export default function TodoProvider({ children }: UserContextProps) {
  const [user, setUser] = useState<UserId | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const cookies = parseCookies();

  const persistUser = useCallback(async () => {
    if (cookies["user_id"]) {
      const { data } = await http.get(`user/${cookies["user_id"]}`);
      setUser(data);
      setUserInfo(data);
    }
  }, []);

  useEffect(() => {
    persistUser();
  }, [persistUser]);

  return (
    <TodoContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
