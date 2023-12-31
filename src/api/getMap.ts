import axios from "axios";
import { env } from "../env";

export const getMap = async () => {
  const { data } = await axios.get(
    `${env.REACT_APP_API_URL}/v1/clusters?format=json`,
    {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
};
