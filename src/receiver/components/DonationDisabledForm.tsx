import { Box, Grid, TextField, Typography, useTheme } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Donation } from "../../donor/types/Donation";

interface DonationDisabledFormProps {
  donation: Donation;
}

const DonationDisabledForm = ({ donation }: DonationDisabledFormProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const textFieldStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: `${theme.palette.text.primary}`,
    },
    width: "100%",
  };

  return (
    <Box>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label={t("receiver.editReservation.details.form.title.label")}
        name="title"
        autoFocus
        disabled
        value={donation.title}
        sx={textFieldStyle}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="location"
        label={t("receiver.editReservation.details.form.location.label")}
        name="location"
        disabled
        value={donation.location}
        sx={textFieldStyle}
      />

      <Typography
        component="h2"
        variant="body2"
        sx={{ mb: 1, mt: 1 }}
        color="text.secondary"
      >
        {t("receiver.editReservation.details.form.from.label")}
      </Typography>
      <Grid container spacing={1} marginTop={1}>
        <Grid item xs>
          <DatePicker
            label={t("receiver.editReservation.details.form.date.label")}
            value={dayjs(donation.from)}
            disabled
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs>
          <TimePicker
            label={t("receiver.editReservation.details.form.time.label")}
            value={dayjs(donation.from)}
            disabled
            sx={textFieldStyle}
          />
        </Grid>
      </Grid>

      <Typography
        component="h2"
        variant="body2"
        sx={{ mb: 1, mt: 2 }}
        color="text.secondary"
      >
        {t("receiver.editReservation.details.form.until.label")}
      </Typography>
      <Grid container spacing={1} marginTop={1}>
        <Grid item xs>
          <DatePicker
            label={t("receiver.editReservation.details.form.date.label")}
            value={dayjs(donation.until)}
            disabled
            sx={textFieldStyle}
          />
        </Grid>
        <Grid item xs>
          <TimePicker
            label={t("receiver.editReservation.details.form.time.label")}
            value={dayjs(donation.until)}
            disabled
            sx={textFieldStyle}
          />
        </Grid>
      </Grid>

      <TextField
        margin="normal"
        fullWidth
        id="additionalInfo"
        label={t("receiver.editReservation.details.form.additionalInfo.label")}
        multiline={true}
        rows={3}
        name="additionalInfo"
        disabled
        value={donation.additionalInfo}
        sx={textFieldStyle}
      />
    </Box>
  );
};

export default DonationDisabledForm;
