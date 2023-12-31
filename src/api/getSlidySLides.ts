import axios from "axios";
import { env } from "../env";

interface CameraImage {
  raw: string[];
}

interface CameraMeta {
  title: string;
  viewCount: number;
  webcamId: number;
  status: string;
  lastUpdatedOn: string;
  categories: CameraCategory[];
  images: {
    current: {
      icon: string;
      thumbnail: string;
      preview: string;
    };
    sizes: {
      icon: {
        width: number;
        height: number;
      };
      thumbnail: {
        width: number;
        height: number;
      };
      preview: {
        width: number;
        height: number;
      };
    };
    daylight: {
      icon: string;
      thumbnail: string;
      preview: string;
    };
  };
  location: CameraLocation;
  player: {
    day: string;
    month: string;
    year: string;
    lifetime: string;
  };
  urls: {
    detail: string;
    edit: string;
    provider: string;
  };
}

interface CameraCategory {
  id: string;
  name: string;
}

interface CameraLocation {
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_code: string;
  continent: string;
  continent_code: string;
  latitude: number;
  longitude: number;
}

interface CameraScheme {
  images: CameraImage;
  meta: CameraMeta;
}

interface CameraData {
  id: number;
  camera_cluster_id: number;
  clearance_level: number;
  camera_scheme: CameraScheme;
}

export const getSlides = async (id: string) => {
  const { data } = await axios.get<CameraData>(
    `${env.REACT_APP_API_URL}/v1/cameras/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return data;
};
