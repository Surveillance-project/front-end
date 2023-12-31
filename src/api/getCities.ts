const allCities = [
  {
    country: "Germany",
    city: "Munich",
  },
  {
    country: "Poland",
    city: "Gdansk",
  },
];

export const getCities = async (country: string) => {
  return allCities.filter((i) => i.country === country);
};
