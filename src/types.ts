interface CameraCategory {
  id: string;
  name: string;
}

interface CameraLocation {
  country: string;
  city: string;
  district: string;
}

interface Camera {
  webcam_id: number;
  status: string;
  categories: CameraCategory[];
  location: CameraLocation;
}

interface ClusterMeta {
  id: number;
  district_name: string;
  name: string;
  district: number;
}

export interface CameraData {
  cameras: Camera[];
  cluster_meta: ClusterMeta;
}
