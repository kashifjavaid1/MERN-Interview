import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:4001",
});
export default AxiosInstance;
