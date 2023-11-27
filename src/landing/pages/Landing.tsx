import {
  BackHand as BackHandIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useSendMessage } from "../../core/hooks/useSendMessage";
import LandingLayout from "../components/LandingLayout";

const Landing = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string>("donor");
  const snackbar = useSnackbar();
  const { sendMessage, isSending } = useSendMessage();

  const handleSendMessage = async (email: string, message: string) => {
    try {
      await sendMessage({ email, message });
      snackbar.success(t("landing.notifications.formSubmitted"));
      formik.resetForm();
    } catch {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      message: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: async (values) => handleSendMessage(values.email, values.message),
  });

  const handleUserRole = (
    event: React.MouseEvent<HTMLElement>,
    newUserRole: string
  ) => {
    setUserRole(newUserRole);
  };

  return (
    <LandingLayout>
      <Grid
        container
        component="main"
        gap={3}
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          p: "5%",
        }}
      >
        <Grid item container justifyContent="center" xs={5}>
          <Typography variant="h1" color="text.primary" marginBottom={3}>
            {t("landing.hero.title")}
          </Typography>
          <Typography variant="body1" color="text.primary" marginBottom={3}>
            {t("landing.hero.subTitle")}
          </Typography>
          <Button
            component={RouterLink}
            to={`/${process.env.PUBLIC_URL}/register`}
            variant="contained"
            sx={{
              mr: "auto",
            }}
          >
            {t("landing.hero.cta")}
          </Button>
        </Grid>

        <Grid item xs>
          <Box
            component="img"
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: "15px",
            }}
            alt={t("landing.hero.imgAlt")}
            src="https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
          />
        </Grid>
      </Grid>

      <Container
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          color="text.primary"
          marginBottom={4}
        >
          {t("landing.howItWorks.title")}
        </Typography>

        <ToggleButtonGroup
          value={userRole}
          exclusive
          onChange={handleUserRole}
          aria-label="user role"
          sx={{ mx: "auto", mb: 3 }}
        >
          <ToggleButton value="donor" aria-label="donor role">
            <VolunteerActivismIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t("landing.howItWorks.donor.toggleText")}
            </Typography>
          </ToggleButton>
          <ToggleButton value="receiver" aria-label="receiver role">
            <BackHandIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {t("landing.howItWorks.receiver.toggleText")}
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <Grid
          sx={{ flexGrow: 1 }}
          container
          spacing={2}
          justifyContent="center"
        >
          {[1, 2, 3, 4].map((step) => (
            <Grid item xs justifyContent="center" key={step}>
              <Box
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                alt={t(`landing.howItWorks.${userRole}.steps.${step}.imgAlt`)}
                src="https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
              />
              <Typography variant="h6" textAlign="center">
                {t(`landing.howItWorks.${userRole}.steps.${step}.message`)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
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

        {[1, 2, 3, 4].map((p) => (
          <Grid
            key={p}
            sx={{
              flexGrow: 1,
              flexDirection: p % 2 === 0 ? "row" : "row-reverse",
            }}
            container
            spacing={2}
            justifyContent="center"
            marginBottom={3}
          >
            <Grid item xs={5} display="flex" justifyContent="center">
              <Box
                component="img"
                sx={{
                  height: "200px",
                }}
                alt={t(`landing.aboutUs.paragraphs.${p}.imgAlt`)}
                src="https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
              ></Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h4">
                {t(`landing.aboutUs.paragraphs.${p}.title`)}
              </Typography>
              <Typography variant="body1">
                {t(`landing.aboutUs.paragraphs.${p}.text`)}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Container>

      <Container
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "right",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          color="text.primary"
          marginBottom={4}
        >
          {t("landing.getInTouch.title")}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          width="600px"
          sx={{ mx: "auto", display: "flex", flexDirection: "column" }}
        >
          <TextField
            margin="normal"
            variant="filled"
            required
            fullWidth
            id="email"
            label={t("landing.getInTouch.form.email.label")}
            name="email"
            autoComplete="email"
            disabled={isSending}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            variant="filled"
            multiline
            rows={4}
            required
            fullWidth
            name="message"
            label={t("landing.getInTouch.form.message.label")}
            id="message"
            disabled={isSending}
            value={formik.values.message}
            onChange={formik.handleChange}
            error={formik.touched.message && Boolean(formik.errors.message)}
            helperText={formik.touched.message && formik.errors.message}
          />
          <LoadingButton
            type="submit"
            loading={isSending}
            variant="contained"
            sx={{ mt: 3, alignSelf: "flex-end" }}
          >
            {t("landing.getInTouch.form.submit")}
          </LoadingButton>
        </Box>
      </Container>
    </LandingLayout>
  );
};

export default Landing;
