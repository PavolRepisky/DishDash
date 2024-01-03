import { LoadingButton } from "@mui/lab";
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
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import { Reservation } from "../../donor/types/Reservation";
import { useCreateReservation } from "../hooks/useCreateReservation";
import { useReservations } from "../hooks/useReservations";
import { useUpdateReservation } from "../hooks/useUpdateReservation";

const EditReservation = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();
  const [itemsStatus, setItemsStatus] = useState("");
  const [reservationData, setReservationData] = useState<any>();
  const snackbar = useSnackbar();
  const { createReservation, isCreating } = useCreateReservation();
  const { updateReservation, isUpdating } = useUpdateReservation();

  const editMode = window.location.href.includes("/edit/");

  const handleSubmitItems = () => {
    const reservation = {
      id: reservationData.id,
      donationId: reservationData.donationId,
      createdAt: reservationData.createdAt,
      items: reservationData.items.map((item: any) => ({
        id: item.id,
        quantity: item.reserved,
      })),
    };

    if (editMode) {
      handleUpdateReservation(reservation);
    } else {
      handleCreateReservation(reservation);
    }
  };

  const handleCreateReservation = async (reservation: Reservation) => {
    try {
      await createReservation(reservation as Reservation);
      snackbar.success(
        t("receiver.createReservation.notifications.createSuccess")
      );
      navigate(`/${process.env.PUBLIC_URL}/receiver/reservations`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const handleUpdateReservation = async (reservation: Reservation) => {
    try {
      await updateReservation(reservation as Reservation);
      snackbar.success(
        t("receiver.createReservation.notifications.updateSuccess")
      );
      navigate(`/${process.env.PUBLIC_URL}/receiver/reservations`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  useEffect(() => {
    if (!editMode) {
      const donation = allDonations?.find((donation) => donation.id === id);

      if (!donation) {
        navigate(`/${process.env.PUBLIC_URL}/404`);
      }

      setReservationData({
        ...donation,
        donationId: donation?.id,
        items: donation?.items.map((item) => ({ ...item, reserved: 0 })),
      });
    } else {
      const reservation = allReservations?.find(
        (reservation) => reservation.id === id
      );

      if (!reservation) {
        navigate(`/${process.env.PUBLIC_URL}/404`);
      }

      const donation = allDonations?.find(
        (donation) => donation.id === reservation?.id
      );

      setReservationData({
        ...donation,
        id: reservation?.id,
        donationId: reservation?.donationId,
        createdAt: reservation?.createdAt,
        items: donation?.items.map((item) => ({
          ...item,
          reserved:
            reservation?.items.find((item2) => item.id === item2.id)
              ?.quantity ?? 0,
        })),
      });
    }
  }, [navigate, allDonations, allReservations, editMode, id]);

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
              value={reservationData?.title}
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
              value={reservationData?.location}
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
                  value={dayjs(reservationData?.from)}
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("receiver.editReservation.details.form.time.label")}
                  value={dayjs(reservationData?.from)}
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
                  value={dayjs(reservationData?.until)}
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("receiver.editReservation.details.form.time.label")}
                  value={dayjs(reservationData?.until)}
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
              value={reservationData?.additionalInfo}
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

          {reservationData?.items?.map((item: any, index: number) => {
            return (
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
                    value={item.reserved}
                    onChange={(event: Event, value: number | number[]) => {
                      setReservationData((prevData: any) => {
                        const updatedItems = prevData.items.map((item2: any) =>
                          item2.id === item.id
                            ? {
                                ...item2,
                                reserved: Array.isArray(value)
                                  ? value[0]
                                  : value,
                              }
                            : item2
                        );

                        return { ...prevData, items: updatedItems };
                      });
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
                        value: item.reserved,
                        label: `${item.reserved}${item.unit}`,
                      },
                      {
                        value: item.quantity,
                        label: `${item.quantity}${item.unit}`,
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            );
          })}

          <Box sx={{ mt: 5, display: "flex", justifyContent: "end" }}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreating || isUpdating}
              loading={isCreating || isUpdating}
              onClick={handleSubmitItems}
            >
              {editMode
                ? t("receiver.editReservation.submit")
                : t("receiver.createReservation.submit")}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default EditReservation;
