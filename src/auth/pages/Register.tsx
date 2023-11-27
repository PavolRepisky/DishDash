import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import LandingLayout from "../../landing/components/LandingLayout";
import { useRegister } from "../hooks/useRegister";
import { UserInfo } from "../types/userInfo";

const roles = [
  { label: "auth.register.form.role.options.donor", value: "donor" },
  { label: "auth.register.form.role.options.receiver", value: "receiver" },
];

const Register = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { isRegistering, register } = useRegister();

  const phoneReg = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "donor",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      lastName: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      phone: Yup.string()
        .matches(phoneReg, t("common.validations.phone"))
        .required(t("common.validations.required")),
      password: Yup.string()
        .min(8, t("common.validations.min", { size: 8 }))
        .required(t("common.validations.required")),
    }),
    onSubmit: (values) => handleRegister(values),
  });

  const handleRegister = async (values: Partial<UserInfo>) => {
    try {
      await register(values as UserInfo);
      snackbar.success(t("auth.register.notifications.success"));
      navigate(`/${process.env.PUBLIC_URL}/login`);
    } catch {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  return (
    <LandingLayout>
      <Grid container sx={{ minHeight: "calc(100vh - 150px)" }}>
        <Grid item xs={12} md={7} alignContent="center" height="100%">
          <Box
            component="img"
            sx={{
              width: "100%",
            }}
            src="https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} square>
          <BoxedLayout>
            <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
              {t("auth.register.title")}
            </Typography>
            <Typography component="h1" variant="body1" sx={{ mb: 2 }}>
              {t("auth.register.subTitle")}
            </Typography>
            <Box component="form" noValidate onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label={t("auth.register.form.firstName.label")}
                name="firstName"
                autoComplete="given-name"
                disabled={isRegistering}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label={t("auth.register.form.lastName.label")}
                name="lastName"
                autoComplete="family-name"
                autoFocus
                disabled={isRegistering}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("auth.register.form.email.label")}
                name="email"
                autoComplete="email"
                disabled={isRegistering}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label={t("auth.register.form.phone.label")}
                name="phone"
                autoComplete="tel"
                disabled={isRegistering}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="password"
                label={t("auth.register.form.password.label")}
                name="password"
                autoComplete="password"
                disabled={isRegistering}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  {t("auth.register.form.role.label")}
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                >
                  {roles.map((role) => (
                    <FormControlLabel
                      control={<Radio />}
                      key={role.value}
                      disabled={isRegistering}
                      label={t(role.label)}
                      value={role.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isRegistering}
                loading={isRegistering}
                sx={{ mt: 2 }}
              >
                {t("auth.register.submit")}
              </LoadingButton>

              <Typography
                component="h1"
                variant="body1"
                textAlign="center"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("auth.register.existingAccount")}
                <Link
                  component={RouterLink}
                  to={`/${process.env.PUBLIC_URL}/login`}
                  sx={{ ml: 1, fontWeight: "medium" }}
                >
                  {t("auth.register.existingAccountLink")}
                </Link>
              </Typography>
            </Box>
          </BoxedLayout>
        </Grid>
      </Grid>
    </LandingLayout>
  );
};

export default Register;
