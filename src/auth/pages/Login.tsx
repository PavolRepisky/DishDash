import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormHelperText,
  Link,
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
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [loginStatus, setLoginStatus] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("common.validations.email"))
      .required(t("common.validations.required")),
    password: Yup.string()
      .min(8, t("common.validations.min", { size: 8 }))
      .required(t("common.validations.required")),
  });

  type FormData = Yup.InferType<typeof validationSchema>;

  const handleLogin = async (data: FormData) => {
    try {
      const user = await login(data.email, data.password);
      navigate(
        `/${process.env.PUBLIC_URL}/${
          user.role === "donor" ? "donor" : "receiver"
        }`,
        { replace: true }
      );
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setLoginStatus(t("auth.login.invalidCredentials"));
        return;
      }
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "tester@uniba.sk",
      password: "Password123",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <LandingLayout>
      <BoxedLayout>
        <Typography
          component="h1"
          variant="h2"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.login.title")}
        </Typography>
        <Typography
          component="h1"
          variant="body1"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.login.subTitle")}
        </Typography>

        <FormHelperText error={Boolean(loginStatus)} component="h1">
          <Typography variant="body1">{loginStatus}</Typography>
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
            label={t("auth.login.form.email.label")}
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isLoggingIn}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("auth.login.form.password.label")}
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isLoggingIn}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Box sx={{ textAlign: "right" }}>
            <Link
              component={RouterLink}
              to={`/${process.env.PUBLIC_URL}/forgot-password`}
              variant="body1"
              sx={{ fontWeight: "medium" }}
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </Box>

          <LoadingButton
            type="submit"
            fullWidth
            loading={isLoggingIn}
            variant="contained"
            sx={{ mt: 3 }}
          >
            {t("auth.login.form.submit")}
          </LoadingButton>
        </Box>

        <Typography
          component="h1"
          variant="body1"
          textAlign="center"
          sx={{ mt: 3, mb: 15 }}
        >
          {t("auth.login.newAccount.question")}
          <Link
            component={RouterLink}
            to={`/${process.env.PUBLIC_URL}/register`}
            sx={{ ml: 1, fontWeight: "medium" }}
          >
            {t("auth.login.newAccount.action")}
          </Link>
        </Typography>
      </BoxedLayout>
    </LandingLayout>
  );
};

export default Login;
