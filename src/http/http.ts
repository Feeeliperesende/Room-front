import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();
const http = axios.create({
  baseURL: "http://localhost:3333/api/v1",
  headers: {
    Authorization: `Bearer ${cookies["@token"]}`,
  },
});

export default http;
