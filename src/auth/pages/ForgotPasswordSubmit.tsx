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
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import LandingLayout from "../../landing/components/LandingLayout";
import { useForgotPasswordSubmit } from "../hooks/useForgotPasswordSubmit";

const ForgotPasswordSubmit = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [codeStatus, setCodeStatus] = useState("");
  const { forgotPasswordSubmit, isLoading } = useForgotPasswordSubmit();

  const formik = useFormik({
    initialValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().required(t("common.validations.required")),
      newPassword: Yup.string()
        .min(8, t("common.validations.min", { size: 8 }))
        .required(t("common.validations.required")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          t("common.validations.passwordMatch")
        )
        .required(t("common.validations.required")),
    }),
    onSubmit: ({ code, newPassword }) =>
      handleSubmitPassword(code, newPassword),
  });

  const handleSubmitPassword = async (code: string, newPassword: string) => {
    try {
      await forgotPasswordSubmit({ code, newPassword });
      snackbar.success(t("auth.forgotPasswordSubmit.notifications.success"));
      navigate(`/${process.env.PUBLIC_URL}/login`);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setCodeStatus(t("auth.forgotPasswordSubmit.invalidCode"));
        return;
      }
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  return (
    <LandingLayout>
      <BoxedLayout>
        <Typography
          component="h1"
          variant="h2"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.forgotPasswordSubmit.title")}
        </Typography>
        <Typography
          component="h1"
          variant="body1"
          sx={{ mb: 2 }}
          textAlign="center"
        >
          {t("auth.forgotPasswordSubmit.subTitle")}
        </Typography>

        <FormHelperText error={Boolean(codeStatus)} component="h1">
          <Typography variant="body1">{codeStatus}</Typography>
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
            id="code"
            label={t("auth.forgotPasswordSubmit.form.code.label")}
            name="code"
            autoFocus
            disabled={isLoading}
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label={t("auth.forgotPasswordSubmit.form.newPassword.label")}
            type="password"
            id="newPassword"
            disabled={isLoading}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={t("auth.forgotPasswordSubmit.form.confirmPassword.label")}
            type="password"
            id="confirmPassword"
            disabled={isLoading}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
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
            {t("auth.forgotPasswordSubmit.form.action")}
          </LoadingButton>
          <Button
            variant="outlined"
            component={Link}
            to={`/${process.env.PUBLIC_URL}/login`}
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {t("auth.forgotPasswordSubmit.form.back")}
          </Button>
        </Box>
      </BoxedLayout>
    </LandingLayout>
  );
};

export default ForgotPasswordSubmit;
