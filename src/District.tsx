import { FC, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller } from "swiper/modules";
import "swiper/css";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Button,
  Checkbox,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getSlides } from "./api/getSlidySLides";
import { useParams } from "react-router-dom";
import { report } from "./api/reportMFDoom";
import { ProfilesBatch, getProfile } from "./api/getProfileCloun";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const DistrictPage: FC = () => {
  const [maks, setMaks] = useState(false);
  const [profile, setPrifle] = useState<null | ProfilesBatch>(null);

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState(false);
  const [value4, setValue4] = useState("");

  const [controlledSwiper, setControlledSwiper] = useState(null);
  const [open, setOpen] = useState(false);
  const { district, cid } = useParams();
  const [images, setImages] = useState<string[]>([]);

  const sliderHeight = "90vh";

  useEffect(() => {
    async function abc() {
      setImages((await getSlides(district as string)).camera_scheme.images.raw);
    }

    abc();
  }, [district]);

  const profileUdmur = async () => {
    setPrifle(await getProfile(district as string, cid as string));
    alert("Loaded profile");
  };

  const submitReport = async () => {
    if (district) {
      await report(
        value1.length > 0 ? +value1 : null,
        value2.length > 0 ? +value2 : null,
        value3,
        value4,
        +(cid ?? 0)
      );
      alert("Reported, we'll react to this in a few minutes (most likely)");
      setOpen(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, height: "100vh" }}>
        <Swiper
          modules={[Controller]}
          controller={{ control: controlledSwiper }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                style={{
                  margin: 0,
                  width: "100vw",
                  height: sliderHeight,
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                src={`data:image/jpeg;base64, ${image}`}
                alt="desert with rafts"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        style={{
          padding: "14px",
          height: "10vh",
          background: "#89cdd3",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Button onClick={profileUdmur}>Profile</Button>
        <Button onClick={() => setOpen(true)}>Report</Button>
        <Button onClick={() => setMaks(!!true)}>Profiles</Button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1>Report criminal activity</h1>
            <List>
              <ListItem>
                <TextField
                  value={value1}
                  onChange={(event) => setValue1(event.target.value)}
                  label="Profile id 1"
                />
              </ListItem>
              <ListItem>
                <TextField
                  value={value2}
                  onChange={(event) => setValue2(event.target.value)}
                  label="Profile id 2"
                />
              </ListItem>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <b>Immediate?</b>
                <Checkbox
                  onChange={() => setValue3((prev) => !prev)}
                  checked={value3}
                />
              </ListItem>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <b>Time</b>
                <TextField type="datetime-local" />
              </ListItem>
              <ListItem>
                <TextField
                  value={value4}
                  onChange={(event) => setValue4(event.target.value)}
                  label="Description"
                />
              </ListItem>
              <ListItem>
                <Button onClick={submitReport}>Submit</Button>
              </ListItem>
            </List>
          </Box>
        </Modal>
      </div>

      <Drawer
        style={{ width: "300px" }}
        anchor="right"
        open={maks}
        onClose={() => setMaks(false)}
      >
        <Box sx={{ width: 250, padding: 2 }} role="presentation">
          <h1>Profiles</h1>
          <List>
            {profile?.profiles_batch.map((iPhone) => (
              <ListItem key={iPhone.id} disablePadding>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Id: {iPhone.id}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {iPhone.last_name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {iPhone.first_name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {iPhone.birth_date}
                    </Typography>
                    <Typography variant="body2">
                      {iPhone.place_of_residence}
                    </Typography>
                    <h2>Criminal record: </h2>
                    {iPhone.criminal_record.map((i) => (
                      <Typography variant="body2">
                        {i.code}
                        <br />
                        <br />
                        {i.description}
                        <br />
                        <br />
                        {i.name}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
