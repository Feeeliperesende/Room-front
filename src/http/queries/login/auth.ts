import http from "@/http/http";

export interface LoginUser {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginUser) => {
  const res = await http
    .post(`/auth/login`, {
      ...data,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return res.data;
};
