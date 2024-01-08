import { LoadingButton } from "@mui/lab";
import { Box, FormHelperText, Grid, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import { Reservation } from "../../donor/types/Reservation";
import { ReservationItem } from "../../donor/types/ReservationItem";
import DonationDisabledForm from "../components/DonationDisabledForm";
import { useCreateReservation } from "../hooks/useCreateReservation";

const CreateReservation = () => {
  const { id: donationId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [items, setItems] = useState<ReservationItem[]>([]);
  const [itemsStatus, setItemsStatus] = useState("");

  const { data: allDonations } = useDonations();
  const { createReservation, isCreating } = useCreateReservation();

  const donation = allDonations?.find((donation) => donation.id === donationId);

  const handleCreateReservation = async () => {
    if (items.every((item) => item.quantity === 0)) {
      setItemsStatus(t("receiver.editReservation.details.form.noItems"));
      return;
    }

    const updatedItems = items.filter((item) => item.quantity > 0);
    const reservation = {
      donationId: donation?.id,
      items: updatedItems,
    };

    try {
      const createdReservation = await createReservation(
        reservation as Reservation
      );
      snackbar.success(
        t("receiver.createReservation.notifications.createSuccess")
      );
      navigate(
        `/${process.env.PUBLIC_URL}/receiver/reservations/${createdReservation.id }`
      );
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  useEffect(() => {
    if (!donation) {
      navigate(`/${process.env.PUBLIC_URL}/404`);
    }

    const initialItems = donation?.items.map((donationItem) => {
      return {
        id: donationItem.id ?? "",
        quantity: 0,
      };
    });
    setItems(initialItems ?? []);
  }, [navigate, donation]);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar
          title={t("receiver.createReservation.title")}
        ></AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("receiver.editReservation.details.title")}
          </Typography>

          {donation && <DonationDisabledForm donation={donation} />}
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
            const donationItem = donation?.items.find(
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
              variant="contained"
              color="primary"
              disabled={isCreating}
              loading={isCreating}
              onClick={handleCreateReservation}
            >
              {t("receiver.createReservation.submit")}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateReservation;
