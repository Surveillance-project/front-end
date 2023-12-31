import axios from "axios";
import { env } from "../env";

interface CriminalRecord {
  code: string;
  name: string;
  description: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  place_of_residence: string;
  criminal_record: CriminalRecord[];
}

export interface ProfilesBatch {
  profiles_batch: UserProfile[];
}

export const getProfile = async (id: string, id2: string) => {
  const { data } = await axios.get<ProfilesBatch>(
    `${env.REACT_APP_API_URL}/v1/filters/criminal_profiler/processed_images/${id}/${id2}`,
    {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
};
