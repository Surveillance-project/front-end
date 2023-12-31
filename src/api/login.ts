import axios from "axios";
import { env } from "../env";

export const login = async (username: string, password: string) => {
  const body = JSON.stringify({ username, password });
  const { data } = await axios.post(
    `${env.REACT_APP_API_URL}/v1/token/?format=json`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
