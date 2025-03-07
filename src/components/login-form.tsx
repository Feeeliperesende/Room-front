"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/http/queries/login/auth";
import { toast } from "sonner";
import { setCookie } from "nookies";
import { TodoContext, TodoContextTypes } from "@/contexts/user";
import { useContext } from "react";

interface LoginUser {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email({ message: "Informe um e-mail valido" }),
  password: z.string().min(6, { message: "Informe a senha" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { setUserInfo } = useContext<TodoContextTypes>(TodoContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "dev.feliperesende@gmail.com",
      password: "Tester@123",
    },
  });
  const router = useRouter();

  const auth = useMutation({
    mutationFn: (data: LoginUser) => loginUser(data),
    onSuccess: (res) => {
      toast.success("Login realizado com sucesso!");
      router.replace("/dashboard");

      setCookie(undefined, "@token", res.token);
      setCookie(undefined, "user_id", res?.id);
      setUserInfo({
        email: res.email,
        first_name: res.first_name,
        id: res.id,
        last_name: res.last_name,
        phone: res.phone,
      });

      reset();
    },
    onError: () => {
      toast.error(`Email ou senha incorretos`);
    },
  });

  const onSubmit: SubmitHandler<LoginUser> = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Preencha todos os campos");

      return;
    }

    auth.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça Login</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira seu e-mail abaixo para fazer login em sua conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors?.email && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.email?.message}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors?.password && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.password?.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full h-[45px] rounded-md  cursor-pointer"
          disabled={auth.isPending}
        >
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Ainda não tem uma conta?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="underline underline-offset-4 cursor-pointer"
        >
          Inscrever-se
        </span>
      </div>
    </form>
  );
}
