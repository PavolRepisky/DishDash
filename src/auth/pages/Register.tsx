import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import LandingLayout from "../../landing/components/LandingLayout";
import { useRegister } from "../hooks/useRegister";
import countryCodes from "../types/CountryCodes.json";
import { phoneRegex } from "../types/PhoneRegex";
import { UserInfo } from "../types/userInfo";

const roles = [
  { label: "auth.register.form.role.options.donor", value: "donor" },
  { label: "auth.register.form.role.options.receiver", value: "receiver" },
];

const sortedcountryCodes = countryCodes
  .slice()
  .sort((a, b) => a.code.localeCompare(b.code));

const Register = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { isRegistering, register } = useRegister();

  const [areaCode, setAreaCode] = useState("+421");

  const handleNumberChange = (event: SelectChangeEvent<string>) => {
    setAreaCode(event.target.value);
  };

  const validationSchema = Yup.object({
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
      .matches(phoneRegex, t("common.validations.phone"))
      .required(t("common.validations.required")),
    password: Yup.string()
      .min(8, t("common.validations.min", { size: 8 }))
      .required(t("common.validations.required")),
    role: Yup.string().matches(
      /^(donor|receiver)$/i,
      t("common.validations.invalid")
    ),
  });

  type FormData = Yup.InferType<typeof validationSchema>;

  const handleRegister = async (values: FormData) => {
    try {
      await register(values as UserInfo);
      snackbar.success(t("auth.register.notifications.success"));
      navigate(`/${process.env.PUBLIC_URL}/login`);
    } catch {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+421",
      password: "",
      role: "donor",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <LandingLayout>
      <Grid container sx={{ display: "flex", alignItems: "center" }}>
        <Grid item xs={12} md={7} alignContent="center" height="100%">
          <Box
            component="img"
            sx={{
              width: "100%",
            }}
            src="img/startup.svg"
            alt={t("auth.register.imageAlt")}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} square>
          <BoxedLayout>
            <Typography component="h2" variant="h2" sx={{ mb: 1 }}>
              {t("auth.register.title")}
            </Typography>
            <Typography component="h1" variant="body1" sx={{ mb: 3 }}>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        value={areaCode}
                        onChange={handleNumberChange}
                        sx={{ "& fieldset": { border: "none" }, "& .MuiSelect-select": { paddingRight: 0, paddingLeft: 0 }}}
                      >
                        {sortedcountryCodes.map((option) => (
                          <MenuItem key={option.code} value={option.dial_code}>
                            {`${option.code} ${option.dial_code}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                }}
                label={t("auth.register.form.phone.label")}
                name="phone"
                placeholder="Phone number with country code"
                autoComplete="tel"
                disabled={isRegistering}
                value={formik.values.phone.slice(areaCode.length)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue(
                    "phone",
                    `${areaCode}${event.target.value}`
                  );
                }}
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
                autoComplete="new-password"
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
                  aria-label={t("auth.register.form.role.aria")}
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
                sx={{ mt: 3 }}
              >
                {t("auth.register.form.submit")}
              </LoadingButton>

              <Typography
                component="h1"
                variant="body1"
                textAlign="center"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("auth.register.existingAccount.question")}
                <Link
                  component={RouterLink}
                  to={`/${process.env.PUBLIC_URL}/login`}
                  sx={{ ml: 1, fontWeight: "medium" }}
                >
                  {t("auth.register.existingAccount.action")}
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
