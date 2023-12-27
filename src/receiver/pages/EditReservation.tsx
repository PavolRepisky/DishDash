import {
  Box,
  FormHelperText,
  Grid,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useDonations } from "../../donor/hooks/useDonations";
import { DonationItem } from "../../donor/types/DonationItem";
import { useReservations } from "../hooks/useReservations";

const EditReservation = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: reservations } = useReservations();
  const { data: donations } = useDonations();
  const reservation = reservations?.find(
    (reservation) => reservation.id === id
  );
  let donation = donations?.find((donation) => donation.id === id);
  const [itemsStatus, setItemsStatus] = useState("");
  const [items, setItems] = useState<DonationItem[]>([]);

  const editMode = window.location.href.includes("/edit/");

  const handleUpdateItems = (item: DonationItem) => {};

  useEffect(() => {
    if ((editMode && !reservation) || (!editMode && !donation)) {
      navigate(`/${process.env.PUBLIC_URL}/404`);
    }
    if (editMode && reservation) {
      setItems(reservation.items);
    }
  }, [reservation, navigate, editMode, donation]);

  const textFieldStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: `${theme.palette.text.primary}`,
    },
    width: "100%",
  };

  return (
    <>
      <AdminAppBar>
        <AdminToolbar
          title={
            editMode
              ? t("receiver.editReservation.title")
              : t("receiver.createReservation.title")
          }
        ></AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("receiver.editReservation.details.title")}
          </Typography>

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
              value={editMode ? reservation?.title : donation?.title}
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
              value={editMode ? reservation?.location : donation?.location}
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
                  value={dayjs(editMode ? reservation?.from : donation?.from)}
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("receiver.editReservation.details.form.time.label")}
                  value={dayjs(editMode ? reservation?.from : donation?.from)}
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
                  value={dayjs(
                    new Date(
                      (editMode ? reservation?.until : donation?.until) ??
                        new Date()
                    )
                  )}
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("receiver.editReservation.details.form.time.label")}
                  value={dayjs(
                    new Date(
                      (editMode ? reservation?.until : donation?.until) ??
                        new Date()
                    )
                  )}
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              id="additionalInfo"
              label={t(
                "receiver.editReservation.details.form.additionalInfo.label"
              )}
              multiline={true}
              rows={3}
              name="additionalInfo"
              disabled
              value={
                editMode
                  ? reservation?.additionalInfo
                  : donation?.additionalInfo
              }
              sx={textFieldStyle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("receiver.editReservation.items.title")}
          </Typography>

          <FormHelperText
            error={Boolean(itemsStatus)}
            component="h1"
            sx={{ mb: 1 }}
          >
            <Typography variant="body1">{itemsStatus}</Typography>
          </FormHelperText>

          {donation?.items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item>
                <Typography
                  component="h2"
                  variant="body2"
                  sx={{ mb: 1, mt: 1 }}
                  color="text.secondary"
                >
                  {`${item.name} (${item.unit})`}
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  value={
                    editMode && reservation
                      ? reservation.items.find(
                          (reservedItem) => item.name === reservedItem.name
                        )?.quantity || 0
                      : 0
                  }
                  onChange={(event: Event, value: number | number[]) => {
                    console.log(items);
                    setItems((prevItems) =>
                      prevItems.map((prevItem) =>
                        prevItem.name === item.name
                          ? {
                              ...prevItem,
                              quantity: Array.isArray(value) ? value[0] : value,
                            }
                          : prevItem
                      )
                    );
                    console.log(items);
                  }}
                  aria-labelledby="input-slider"
                  min={0}
                  max={item.quantity}
                  marks={[
                    {
                      value: 0,
                      label: `0${item.unit}`,
                    },
                    {
                      value: item.quantity,
                      label: `${item.quantity}${item.unit}`,
                    },
                  ]}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default EditReservation;
