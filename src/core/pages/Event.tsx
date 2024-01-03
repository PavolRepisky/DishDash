import {
  CalendarMonth as CalendarMonthIcon,
  Place as PlaceIcon,
  Web as WebIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import events from "../../mocks/events.json";
import CardCarousel from "../components/CardCarousel";
import RecentNotifications from "../components/RecentNotifications";
import BlurredEdgeImage from "../components/BlurredEdgeImage";

const Event = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const descriptionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down(450), {noSsr: true});

  const upcomingEventId = events.reduce((prev, curr) =>
    Math.abs(Date.parse(curr.date) - Date.now()) <
    Math.abs(Date.parse(prev.date) - Date.now())
      ? curr
      : prev
  ).id;

  const eventId = id === "0" ? upcomingEventId : id;

  const handleEventSelect = (id: String) => {
    if (pathname.includes("donor")) {
      navigate(`/${process.env.PUBLIC_URL}/donor/event/${id}`);
    } else if (pathname.includes("receiver")) {
      navigate(`/${process.env.PUBLIC_URL}/receiver/event/${id}`);
    }
  };

  const eventData = events
    .filter((event) => event.id !== eventId)
    .map((event) => ({
      id: event.id,
      title: event.title,
      location: event.location,
      imageUrl: event.imageUrl,
      primaryActionText: t("donor.home.upcomingEvents.action"),
      primaryAction: () => handleEventSelect(event.id),
    }));

  const currentEvent = events.find((event) => event.id === eventId);

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)} ${date.toLocaleTimeString(
      i18n.language
    )}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // calculate and update image margin depending on where the bottom of the previous text is located
    setTimeout(() => {

      // disable on mobile
      if (xs) return;

      const arraySize = Math.min(imageRefs.current.length, descriptionRefs.current.length);
      for (let index = 1; index < arraySize; index++) {
        const imageEl = imageRefs.current[index];
        const descEl = descriptionRefs.current[index];
        const prevImageEl = imageRefs.current[index-1];
        const prevDescEl = descriptionRefs.current[index-1];
  
        if (imageEl === null || descEl === null || prevImageEl === null || prevDescEl === null) continue;
  
        const image = imageEl.childNodes[0] as HTMLElement;
        const currImgTop = image.getBoundingClientRect().top;
        const prevDescBottom = ((prevDescEl as HTMLElement).childNodes[1] as HTMLElement).getBoundingClientRect().bottom;

        const margin = 90;
        const diff = currImgTop - prevDescBottom - margin;

        if (diff > 0)
          imageEl.style.marginTop = `-${diff}px`;
      }
    }, 30)
    

  }, [xs]);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>

      <Container component={"nav"} disableGutters>
        <Typography component="div" variant="h2" sx={{ mt: 0 }}>
          {t("donor.home.upcomingEvents.browse")}
        </Typography>

        <CardCarousel cards={eventData} cardsPerPage={xs ? 1 : 3} />
      </Container>


      <Typography
        variant="h2"
        align="center"
        color="text.primary"
        sx={{ my: 10 }}
      >
        {currentEvent?.title}
      </Typography>

      <Container
        component={"section"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          background: "white",
          mb: 10,
          py: "24px",
          borderRadius: "25px",
          boxSizing: "border-box"        
        }}
      >
        <Grid container columnSpacing={5}>
          <Grid item xs={12} sm={7}>
            <Typography variant="body1">{currentEvent?.description}</Typography>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Container
              sx={{
                display: "flex",
                height: "100%",
                justifyContent: "space-evenly",
                flexDirection: "column",
                border: 1,
                borderRadius: 1,
                borderColor: "grey.200",
                px: 3,
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                  <PlaceIcon />
                  <Typography
                    variant="body1"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    {t("events.location")}
                  </Typography>
                </Stack>
                <Typography variant="body1" display="flex" alignItems="center">
                  {currentEvent?.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                  <CalendarMonthIcon />
                  <Typography
                    variant="body1"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    {t("events.date")}
                  </Typography>
                </Stack>
                <Typography variant="body1" display="flex" alignItems="center">
                  {formatDate(currentEvent?.date ?? "")}
                </Typography>
              </Box>
              {currentEvent?.webpage && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Stack direction="row" gap={1} sx={{ my: { xs: 1, sm: 0 } }}>
                    <WebIcon />
                    <Typography
                      variant="body1"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      {t("events.website")}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    display="flex"
                    alignItems="center"
                  >
                    <a href={currentEvent?.webpage ?? ""}>
                      {currentEvent?.webpage}
                    </a>
                  </Typography>
                </Box>
              )}
            </Container>
          </Grid>
        </Grid>
      </Container>

      <Container
        component={"section"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mb: 10,
        }}
      >
        <Grid container rowSpacing={10} columnSpacing={3}>
          {currentEvent?.data?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {index % 2 === 1 ? (
                  <>
                    <Grid item ref={el => descriptionRefs.current[index] = el} xs={12} sm={7}>
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        {t(item.heading)}
                      </Typography>
                      <Typography variant="body1">{t(item.text)}</Typography>
                    </Grid>
                    <Grid item ref={el => imageRefs.current[index] = el} xs={12} sm={5}>
                      <BlurredEdgeImage 
                        background={theme.palette.background.default}
                        imageSrc={item.imageUrl}
                        imageAlt={item.imageAlt}
                        sx={{ mt: xs ? 0 : -5 }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item ref={el => imageRefs.current[index] = el} xs={12} sm={5}>
                      <BlurredEdgeImage 
                        background={theme.palette.background.default}
                        imageSrc={item.imageUrl}
                        imageAlt={item.imageAlt}
                        sx={{ mt: xs ? 0 : -5 }}
                      />
                    </Grid>
                    <Grid item ref={el => descriptionRefs.current[index] = el} xs={12} sm={7}>
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        {t(item.heading)}
                      </Typography>
                      <Typography variant="body1">{t(item.text)}</Typography>
                    </Grid>
                  </>
                )}
              </React.Fragment>
          )})}
        </Grid>
      </Container>
    </>
  );
};

export default Event;
