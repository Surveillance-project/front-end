import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { getDistricts } from "./api/getDistricts";
import { getMap } from "./api/getMap";
import { getCities } from "./api/getCities";
import { getRandomHexColor } from "./randomHex";
import { useNavigate } from "react-router-dom";
import { report } from "./api/reportMFDoom";
import { getCameras } from "./api/getCameras";
import { CameraData } from "./types";

export const MapPage: FC = () => {
  const [cameras, setCameras] = useState<CameraData | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<
    {
      cluster_meta: { id: number };
      location: { city: string; country: string; district: string };
    }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [country, setCountry] = useState<null | string>(null);
  const [city, setCity] = useState<null | string>(null);
  const [district, setDistrict] = useState<null | string>(null);
  const navigate = useNavigate();

  const [menu, setMenu] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const loader = useMemo(
    () =>
      new Loader({
        apiKey: "AIzaSyCuHxYkPcQf9qtr-TRZPG8nZgvHQJJYLp0",
        version: "weekly",
      }),
    []
  );

  const renderPolygon = (
    districtID: string,
    districtName: string,
    topRight: google.maps.LatLng,
    bottomLeft: google.maps.LatLng
  ) => {
    const districtPolygon = new google.maps.Polygon({
      fillOpacity: 0.25,
      strokeWeight: 1.25,
      fillColor: getRandomHexColor(),
      paths: [
        {
          lat: topRight?.lat(),
          lng: topRight?.lng(),
        },
        {
          lat: bottomLeft?.lat(),
          lng: topRight?.lng(),
        },
        {
          lat: bottomLeft?.lat(),
          lng: bottomLeft?.lng(),
        },
        {
          lat: topRight?.lat(),
          lng: bottomLeft?.lng(),
        },
      ],
    });

    google.maps.event.addListener(districtPolygon, "click", async function () {
      setDistrict(districtName);

      setCameras(await getCameras(districtID));
      setMenu(true);
    });

    districtPolygon.setMap(mapRef.current);
  };

  const renderDistricts = useCallback(async () => {
    if (city) {
      const districts = allCities.filter(
        (i) => i.location.city === city && i.location.country === country
      );

      const geocoder = new google.maps.Geocoder();

      districts.forEach((i) =>
        geocoder.geocode(
          {
            address: `${i.location.district}, ${i.location.city}, ${i.location.country}`,
          },
          async (results, status) => {
            if (status === "OK") {
              if (results) {
                const [districtGeoData] = results;

                renderPolygon(
                  i.cluster_meta.id.toString(),
                  i.location.district,
                  districtGeoData.geometry.bounds?.getNorthEast() as any,
                  districtGeoData.geometry.bounds?.getSouthWest() as any
                );
              }
            }
          }
        )
      );
    }
  }, [city]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getMap();

        setAllCities(response.map((i: any) => i));
        setCountries(response.map((i: any) => i.location.country));
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (country) setCities(allCities.map((i) => i.location.city));
    }

    fetchData();
  }, [country, allCities]);

  useEffect(() => {
    if (city && country && loader) {
      loader.load().then(async () => {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode(
          { address: `${country}, ${city}` },
          async (results, status) => {
            if (status === "OK") {
              const [firstResult] = results ?? [];
              if (firstResult) {
                mapRef.current = new Map(
                  document.getElementById("map") as HTMLElement,
                  {
                    center: {
                      lat: firstResult.geometry.location.lat(),
                      lng: firstResult.geometry.location.lng(),
                    },
                    zoom: 12,
                  }
                );

                renderDistricts();
                setMenu(false);
              } else alert("This city was not found on google maps");
            } else {
              alert(
                "Geocode was not successful for the following reason: " + status
              );
            }
          }
        );

        // const data = await getDistricts();
      });
    }
  }, [city, country, loader, renderDistricts]);

  return (
    <div>
      <Drawer
        style={{ width: "300px" }}
        anchor="right"
        open={menu}
        onClose={() => setMenu(country && city ? false : true)}
      >
        <Box sx={{ width: 250, padding: 2 }} role="presentation">
          {!country && (
            <>
              <h1>Select country</h1>
              <List>
                {countries.map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => setCountry(text)}>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {country && !city && (
            <>
              <h1>Select city</h1>
              <List>
                {cities.map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton onClick={() => setCity(text)}>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {country && city && district && cameras && (
            <>
              <h1>Do you wanna connect to {district}?</h1>
              <List>
                <ListItem disablePadding>
                  {cameras.cameras.map((i) => (
                    <ListItemButton
                      key={i.webcam_id}
                      onClick={() =>
                        navigate(
                          `/map/${cameras.cluster_meta.id}/${i.webcam_id}`
                        )
                      }
                    >
                      <ListItemText
                        primary={`Connect to ${i.location.district} (${i.webcam_id})`}
                      />
                    </ListItemButton>
                  ))}
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>

      <div style={{ width: "100vw", height: "100vh" }} id="map" />
    </div>
  );
};
