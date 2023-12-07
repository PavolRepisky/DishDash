import {
  BackHand as BackHandIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RotatingNavButton from "../../core/components/RotatingNavButton";
import ContactForm from "../components/ContactForm";
import LandingLayout from "../components/LandingLayout";

const Landing = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string>("donor");

  const handleSwitchUserRole = (
    event: React.MouseEvent<HTMLElement>,
    newUserRole: string
  ) => {
    event.currentTarget.parentElement?.parentElement?.scrollIntoView({ behavior: "smooth"}); // pan how it works into view -> related to user feedback/confusion
    if (newUserRole == null) return;
    setUserRole(newUserRole);
  };

  const aboutUsData = [
    {
      title: "landing.aboutUs.paragraphs.story.title",
      text: "landing.aboutUs.paragraphs.story.text",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/f/f9/Fmfi_f1_zelen.jpg",
      imageAlt: "landing.aboutUs.paragraphs.story.imageAlt",
    },
    {
      title: "landing.aboutUs.paragraphs.mission.title",
      text: "landing.aboutUs.paragraphs.mission.text",
      imageUrl:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "landing.aboutUs.paragraphs.mission.imageAlt",
    },
    {
      title: "landing.aboutUs.paragraphs.goal.title",
      text: "landing.aboutUs.paragraphs.goal.text",
      imageUrl:
        "https://images.unsplash.com/photo-1523815462886-2487223ab7b9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "landing.aboutUs.paragraphs.goal.imageAlt",
    },
    {
      title: "landing.aboutUs.paragraphs.help.title",
      text: "landing.aboutUs.paragraphs.help.text",
      imageUrl:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "landing.aboutUs.paragraphs.help.imageAlt",
    },
  ];

  return (
    <LandingLayout>
      <Container component={"section"}>
        <Grid
          container
          gap={3}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 10,
          }}
        >
          <Grid item container xs={12} md={5}>
            <Typography
              variant="h1"
              color="text.primary"
              sx={{ mb: 2, width: "100%" }}
            >
              {t("landing.hero.title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mb: 3, width: "100%" }}
            >
              {t("landing.hero.subTitle")}
            </Typography>
            <Box sx={{ mr: "auto" }}>
              <RotatingNavButton
                buttonText={t("landing.hero.cta")}
                to={`/${process.env.PUBLIC_URL}/register`}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
              alt={t("landing.hero.imgAlt")}
              src={t("landing.hero.imgUrl")}
            />
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
        <Typography
          variant="h2"
          align="center"
          color="text.primary"
          sx={{ mb: 3 }}
        >
          {t("landing.howItWorks.title")}
        </Typography>

        <ToggleButtonGroup
          value={userRole}
          exclusive
          onChange={handleSwitchUserRole}
          aria-label="user role"
          sx={{ mx: "auto", mb: 3 }}
        >
          <ToggleButton
            value="donor"
            aria-label={t("landing.howItWorks.toggleAriaLabel")}
          >
            <VolunteerActivismIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t("landing.howItWorks.donor.toggleText")}
            </Typography>
          </ToggleButton>
          <ToggleButton
            value="receiver"
            aria-label={t("landing.howItWorks.toggleAriaLabel")}
          >
            <BackHandIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t("landing.howItWorks.receiver.toggleText")}
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <Grid
          sx={{ flexGrow: 1 }}
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {[1, 2, 3, 4].map((step) => (
            <Grid item xs key={step} sx={{ display: "flex" }}>
              <Card
                sx={{
                  bgcolor: "background.default",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  image={t(
                    `landing.howItWorks.${userRole}.steps.${step}.imgUrl`
                  )}
                  alt={t(`landing.howItWorks.${userRole}.steps.${step}.imgAlt`)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {t(`landing.howItWorks.${userRole}.steps.${step}.title`)}
                  </Typography>
                  <Typography variant="body1">
                    {t(
                      `landing.howItWorks.${userRole}.steps.${step}.description`
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
        <Typography
          variant="h2"
          align="center"
          color="text.primary"
          marginBottom={4}
        >
          {t("landing.aboutUs.title")}
        </Typography>

        <Grid container rowSpacing={10} columnSpacing={3}>
          {aboutUsData.map((item, index) => (
            <React.Fragment key={index}>
              {index % 2 === 0 ? (
                <>
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {t(item.title)}
                    </Typography>
                    <Typography variant="body1">{t(item.text)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <img
                      src={item.imageUrl}
                      alt={t(item.imageAlt)}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={5}>
                    <img
                      src={item.imageUrl}
                      alt={t(item.imageAlt)}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {t(item.title)}
                    </Typography>
                    <Typography variant="body1">{t(item.text)}</Typography>
                  </Grid>
                </>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Container>

      <Container
        component={"section"}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "600px",
          }}
        >
          <Typography
            variant="h2"
            align="center"
            color="text.primary"
            marginBottom={2}
          >
            {t("landing.getInTouch.title")}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.primary"
            sx={{ mb: 3 }}
          >
            {t("landing.getInTouch.subtitle")}
          </Typography>
          <ContactForm />
        </Box>
      </Container>
    </LandingLayout>
  );
};

export default Landing;
