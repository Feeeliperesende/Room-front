import http from "@/http/http";

interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
}

export const createAccountUser = async (data: CreateUser) => {
  await http
    .post(`/user/create`, {
      ...data,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
