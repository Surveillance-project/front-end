import axios from "axios";

const allData = [
  {
    cluster_meta: {
      id: 1,
      name: "Altstadt Cluster",
    },
    location: {
      country: "Germany",
      city: "Munich",
      district: "Altstadt",
    },
  },
  {
    cluster_meta: {
      id: 1,
      name: "Altstadt Cluster",
    },
    location: {
      country: "Poland",
      city: "Gdansk",
      district: "Orunia",
    },
  },
  {
    cluster_meta: {
      id: 1,
      name: "Altstadt Cluster",
    },
    location: {
      country: "Poland",
      city: "Gdansk",
      district: "Zaspa",
    },
  },
  {
    cluster_meta: {
      id: 1,
      name: "Altstadt Cluster",
    },
    location: {
      country: "Poland",
      city: "Gdansk",
      district: "Jasien",
    },
  },
];

export const getDistricts = async (city: string) => {
  const { data } = await axios.get(
    "https://1285-94-154-217-204.ngrok-free.app/api/v1/auth",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  // return data;
  return allData.filter((i) => i.location.city === city);
};
