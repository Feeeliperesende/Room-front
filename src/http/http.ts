import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    Authorization: `Bearer ${cookies["@token"]}`,
  },
});

export default http;
