import { LoadingButton } from "@mui/lab";
import { Box, FormHelperText, Grid, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import { Reservation } from "../../donor/types/Reservation";
import { ReservationItem } from "../../donor/types/ReservationItem";
import DonationDisabledForm from "../components/DonationDisabledForm";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";
import { useUpdateReservation } from "../hooks/useUpdateReservation";

const EditReservation = () => {
  const { id: reservationId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [items, setItems] = useState<ReservationItem[]>([]);
  const [itemsStatus, setItemsStatus] = useState("");
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [reservationCanceled, setReservationCanceled] = useState<string[]>([]);

  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();
  const { updateReservation, isUpdating } = useUpdateReservation();
  const { deleteReservations, isDeleting } = useDeleteReservations();

  const reservation = allReservations?.find(
    (reservation) => reservation.id === reservationId
  );
  const matchingDonation = allDonations?.find(
    (donation) => donation.id === reservation?.donationId
  );

  const handleCloseConfirmCancelDialog = () => {
    setOpenConfirmCancelDialog(false);
  };

  const handleOpenConfirmCancelDialog = (reservationId: string) => {
    setReservationCanceled([reservationId]);
    setOpenConfirmCancelDialog(true);
  };

  const handleCancelReservation = async () => {
    try {
      await deleteReservations(reservationCanceled);
      snackbar.success(t("receiver.home.notifications.cancelSuccess"));
      setOpenConfirmCancelDialog(false);
      navigate(`/${process.env.PUBLIC_URL}/receiver/reservations`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const handleUpdateReservation = async () => {
    if (items.every((item) => item.quantity === 0)) {
      setItemsStatus(t("receiver.editReservation.details.form.noItems"));
      return;
    }

    const updatedItems = items.filter((item) => item.quantity > 0);
    const updatedReservation = {
      ...reservation,
      items: updatedItems,
    };

    try {
      await updateReservation(updatedReservation as Reservation);
      snackbar.success(
        t("receiver.editReservation.notifications.updateSuccess")
      );
      navigate(
        `/${process.env.PUBLIC_URL}/receiver/reservations/${reservation?.id}`
      );
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  useEffect(() => {
    if (!reservation || !matchingDonation) {
      navigate(`/${process.env.PUBLIC_URL}/404`);
    }

    const initialItems = matchingDonation?.items.map((donationItem) => {
      return {
        id: donationItem.id ?? "",
        quantity:
          reservation?.items.find(
            (reservationItem) => reservationItem.id === donationItem.id
          )?.quantity ?? 0,
      };
    });
    setItems(initialItems ?? []);
  }, [navigate, reservation, matchingDonation]);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar
          title={t("receiver.editReservation.title")}
        ></AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("receiver.editReservation.details.title")}
          </Typography>

          {matchingDonation && (
            <DonationDisabledForm donation={matchingDonation} />
          )}
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

          {items.map((item, index) => {
            const donationItem = matchingDonation?.items.find(
              (dItem) => dItem.id === item.id
            );

            return (
              <Grid container spacing={2} key={index}>
                <Grid item>
                  <Typography
                    component="h2"
                    variant="body2"
                    sx={{ mb: 1, mt: 1 }}
                    color="text.secondary"
                  >
                    {`${donationItem?.name} (${donationItem?.unit})`}
                  </Typography>
                </Grid>

                <Grid item xs>
                  <Slider
                    value={item.quantity}
                    onChange={(event: Event, value: number | number[]) => {
                      setItemsStatus("");
                      setItems((prevItems) => {
                        const updatedItems = prevItems.map((item) =>
                          item.id === donationItem?.id
                            ? {
                                ...item,
                                quantity: Array.isArray(value)
                                  ? value[0]
                                  : value,
                              }
                            : item
                        );
                        return updatedItems;
                      });
                    }}
                    aria-labelledby="input-slider"
                    min={0}
                    max={donationItem?.quantity}
                    marks={[
                      {
                        value: 0,
                        label: `0${donationItem?.unit}`,
                      },
                      {
                        value: item.quantity,
                        label: `${item.quantity}${donationItem?.unit}`,
                      },
                      {
                        value: donationItem?.quantity ?? 0,
                        label: `${donationItem?.quantity}${donationItem?.unit}`,
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
              variant="outlined"
              color="primary"
              disabled={isDeleting || isUpdating}
              loading={isDeleting || isUpdating}
              onClick={() =>
                handleOpenConfirmCancelDialog(reservation?.id ?? "")
              }
              sx={{ mr: 1 }}
            >
              {t("receiver.editReservation.cancelReservation")}
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isDeleting || isUpdating}
              loading={isDeleting || isUpdating}
              onClick={handleUpdateReservation}
            >
              {t("receiver.editReservation.submit")}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDialog
        description={t("receiver.home.confirmations.cancel")}
        pending={isDeleting}
        onClose={handleCloseConfirmCancelDialog}
        onConfirm={handleCancelReservation}
        open={openConfirmCancelDialog}
        title={t("common.confirmation")}
      />
    </>
  );
};

export default EditReservation;
