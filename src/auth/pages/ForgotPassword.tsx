import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import LandingLayout from "../../landing/components/LandingLayout";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [validationStatus, setValidationStatus] = useState("");

  const { forgotPassword, isLoading } = useForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
    }),
    onSubmit: ({ email }) => handleForgotPassword(email),
  });

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword({ email });
      snackbar.success(t("auth.forgotPassword.notifications.success"));
      navigate(`/${process.env.PUBLIC_URL}/forgot-password-submit`);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setValidationStatus(t("common.validations.email"));
        return;
      }
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  return (
    <LandingLayout>
      <BoxedLayout>
        <Typography
          component="h2"
          variant="h2"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.forgotPassword.title")}
        </Typography>
        <Typography
          component="h1"
          variant="body1"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.forgotPassword.subTitle")}
        </Typography>

        <FormHelperText error={Boolean(validationStatus)} component="h1">
          <Typography variant="body1">{validationStatus}</Typography>
        </FormHelperText>

        <Box
          component="form"
          marginTop={1}
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("auth.forgotPassword.form.email.label")}
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            loading={isLoading}
            sx={{ mt: 2 }}
          >
            {t("auth.forgotPassword.form.action")}
          </LoadingButton>
          <Button
            variant="outlined"
            component={RouterLink}
            to={`/${process.env.PUBLIC_URL}/login`}
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {t("auth.forgotPassword.form.back")}
          </Button>
        </Box>
      </BoxedLayout>
    </LandingLayout>
  );
};

export default ForgotPassword;
