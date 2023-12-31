import axios from "axios";
import { env } from "../env";
import { CameraData } from "../types";

export const getCameras = async (id: string) => {
  const { data } = await axios.get<CameraData>(
    `${env.REACT_APP_API_URL}/v1/clusters/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return data;
};
