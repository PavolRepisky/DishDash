import {
  Coffee as CoffeeIcon,
  Egg as EggIcon,
  LocalPizza as LocalPizzaIcon,
  Pets as PetsIcon,
  QrCode2 as QrCodeIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import DonationDisabledForm from "../components/DonationDisabledForm";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

const ReservationDetail = () => {
  const { id: reservationId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();
  const { deleteReservations, isDeleting } = useDeleteReservations();
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

  const reservation = allReservations?.find(
    (reservation) => reservation.id === reservationId
  );
  const matchingDonation = allDonations?.find(
    (donation) => donation.id === reservation?.donationId
  );

  const handleEditReservation = () => {
    navigate(
      `/${process.env.PUBLIC_URL}/receiver/reservations/edit/${reservationId}`
    );
  };

  const handleCloseConfirmCancelDialog = () => {
    setOpenConfirmCancelDialog(false);
  };

  const handleOpenConfirmCancelDialog = () => {
    setOpenConfirmCancelDialog(true);
  };

  const handleCancelReservation = async () => {
    try {
      await deleteReservations([reservationId]);
      snackbar.success(t("receiver.home.notifications.cancelSuccess"));
      setOpenConfirmCancelDialog(false);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  return (
    <>
      <AdminAppBar>
        <AdminToolbar
          title={t("receiver.reservationDetails.title")}
        ></AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("donor.editDonation.infoForm.title")}
          </Typography>
          {matchingDonation && (
            <DonationDisabledForm donation={matchingDonation} />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("donor.editDonation.itemForm.title")}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <List>
              {reservation?.items.map((reservationItem, index) => {
                const donationItem = matchingDonation?.items.find(
                  (dItem) => dItem.id === reservationItem.id
                );

                return (
                  <ListItem
                    key={index}
                    sx={{
                      borderRadius: 16,
                      border: "1px solid",
                      borderColor: "grey.200",
                      py: 0,
                      mb: 1,
                    }}
                  >
                    {donationItem?.type === "grocery" && <ShoppingBagIcon />}
                    {donationItem?.type === "preparedFood" && (
                      <LocalPizzaIcon />
                    )}
                    {donationItem?.type === "fruitsVegetables" && <EggIcon />}
                    {donationItem?.type === "beverages" && <CoffeeIcon />}
                    {donationItem?.type === "petFood" && <PetsIcon />}

                    <ListItemText
                      primary={donationItem?.name}
                      secondary={`${reservationItem.quantity} ${donationItem?.unit}`}
                      sx={{
                        ml: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Typography component="h2" variant="h3" sx={{ mt: 5, mb: 1 }}>
            {t("receiver.reservationDetails.qrCode")}
          </Typography>
          <Typography
            component="h2"
            variant="body1"
            sx={{ mb: 1 }}
            color="text.secondary"
          >
            {t("receiver.reservationDetails.qrCodeMessage")}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <QrCodeIcon sx={{ fontSize: "15rem" }} />
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="outlined"
            onClick={handleOpenConfirmCancelDialog}
            sx={{ mr: 1 }}
          >
            {t("receiver.editReservation.cancelReservation")}
          </Button>
          <Button variant="contained" onClick={handleEditReservation}>
            {t("common.edit")}
          </Button>
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

export default ReservationDetail;
