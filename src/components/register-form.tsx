"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAccountUser } from "@/http/queries/account/create-account";

interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
}

const schema = z.object({
  first_name: z.string().min(1, { message: "Informe o nome" }),
  last_name: z.string().min(1, { message: "Informe o sobrenome" }),
  email: z.string().email({ message: "Informe um e-mail valido" }),
  phone: z
    .string()
    .min(1, { message: "Informe o telefone" })
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone inválido" }),
  password: z.string().min(6, { message: "Informe a senha" }),

  terms: z.boolean().default(false),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      terms: false,
    },
  });
  const router = useRouter();

  const createAccount = useMutation({
    mutationFn: (data: CreateUser) => createAccountUser(data),
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      router.replace("/");
      reset();
    },
    onError: () => {
      toast.error("Erro ao criar conta.");
    },
  });

  const onSubmit: SubmitHandler<CreateUser> = async (data) => {
    if (!data.terms) {
      toast.error("Aceite os termos");
      return;
    }

    createAccount.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold"> Crie sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          É totalmente gratuito e super fácil
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Input
            id="first_name"
            placeholder="Nome"
            {...register("first_name")}
          />
          {errors?.first_name && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.first_name?.message}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <Input
            id="last_name"
            placeholder="Sobrenome"
            {...register("last_name")}
          />
          {errors?.last_name && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.last_name?.message}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            {...register("email")}
          />
          {errors?.email && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.email?.message}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <Input
            id="phone"
            placeholder="(99) 99999-9999"
            {...register("phone")}
            onChange={(e) => {
              const value = e.target.value;
              const masked = value
                .replace(/\D/g, "")
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d)(\d{4})$/, "$1-$2")
                .slice(0, 15);
              e.target.value = masked;
            }}
          />
          {errors?.phone && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.phone?.message}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Digite sua senha"
          />
          {errors?.password && (
            <p className="mt-2 text-[13px] text-red-300">
              {errors?.password?.message}
            </p>
          )}
        </div>

        <div className="mb-8 flex">
          <label
            htmlFor="checkboxLabel"
            className="flex cursor-pointer select-none text-sm font-medium text-gray-800"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="checkboxLabel"
                {...register("terms")}
                className="sr-only"
              />
              <div className="box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                <span
                  className={`${watch("terms") ? "opacity-100" : "opacity-0"}`}
                >
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                      fill="black"
                      stroke="black"
                      strokeWidth="0.4"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <span>
              Ao criar uma conta, você concorda com os
              <a href="#0" className="text-primary hover:underline">
                {" "}
                Termos e Condições{" "}
              </a>
              , e nossa
              <a href="#0" className="text-primary hover:underline">
                {" "}
                Política de Privacidade{" "}
              </a>
            </span>
          </label>
        </div>
        <Button
          type="submit"
          className="w-full h-[45px] rounded-md cursor-pointer"
          disabled={createAccount.isPending}
        >
          {createAccount.isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Criando conta...
            </div>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        Já possui uma conta?{" "}
        <span
          onClick={() => router.push("/")}
          className="underline underline-offset-4 cursor-pointer"
        >
          Login
        </span>
      </div>
    </form>
  );
}
