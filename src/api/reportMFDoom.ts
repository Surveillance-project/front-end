import axios from "axios";
import { env } from "../env";

export const report = async (
  profileId1: number | null,
  profileId2: number | null,
  isImmediate: boolean,
  leDescription: string,
  cameraIdLol: number
) => {
  const body = JSON.stringify({
    profile_ids: [profileId1, profileId2].filter((i) => i !== null),
    is_immediate: isImmediate,
    description: leDescription,
    from_camera_id: cameraIdLol,
  });
  const { data } = await axios.post(
    `${env.REACT_APP_API_URL}/v1/reports`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return data;
};
