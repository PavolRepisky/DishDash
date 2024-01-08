import {
  Coffee as CoffeeIcon,
  Egg as EggIcon,
  LocalPizza as LocalPizzaIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { createHash } from "crypto";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import CarouselImageItem from "../../core/components/CarouselImageItem";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import ReactGoogleMap from "../../core/components/ReactGoogleMap";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import { Reservation } from "../../donor/types/Reservation";
import DonationDisabledForm from "../components/DonationDisabledForm";
import QRCodeModal from "../components/QRCodeModal";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

const ReservationDetail = () => {
  const { id: reservationId, hash } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const theme = useTheme();

  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();
  const { deleteReservations, isDeleting } = useDeleteReservations();
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);

  const createhash = (obj: any) => {
    const hash = createHash("sha256");
    hash.update(JSON.stringify(obj));
    return hash.digest("hex");
  };

  let reservation: Reservation | undefined;
  let wrongHash = false;

  if (hash) {
    reservation = allReservations?.find((reservation) => {
      const hashed = createhash(reservation);
      console.log(`hashed reservation = ${hashed}`);
      return createhash(reservation) === hash;
    });

    if (reservation === undefined) {
      wrongHash = true;
    }
  } else {
    reservation = allReservations?.find(
      (reservation) => reservation.id === reservationId
    );
  }

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
      navigate(`/${process.env.PUBLIC_URL}/receiver/`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const handleOpenQRModal = () => {
    setOpenQRModal(true);
  };

  const address = matchingDonation?.location;
  const images = matchingDonation?.images?.map((item, index) => ({
    imageUrl: item,
    imageAlt: `Image ${index}`,
  }));

  useEffect(() => {
    if (hash && wrongHash) navigate(`/${process.env.PUBLIC_URL}/404`);
  }, []);

  // this is a workaround
  // TODO - change to the website url once deployed, netlify requires process.env.PUBLIC_URL to be set to "" so this wont work

  let url: string;
  if (process.env.NODE_ENV === "production") {
    url = `https://dishdashproj.netlify.app/qr/${createhash(reservation)}`;
  } else {
    url = `http://localhost:3000/qr/${createhash(reservation)}`;
  }

  console.log(url);

  return (
    <>
      <QRCodeModal
        open={openQRModal}
        handleClose={() => setOpenQRModal(false)}
        hashedReservation={url}
      />

      {!hash && (
        <AdminAppBar>
          <AdminToolbar
            title={t("receiver.reservationDetails.title")}
          ></AdminToolbar>
        </AdminAppBar>
      )}

      <Grid container spacing={3}>
        {!hash && (
          <Grid item xs={12} md={5}>
            <Box mt={1}>
              <Carousel>
                {matchingDonation?.images &&
                  images &&
                  matchingDonation.images?.map((_, index) => {
                    return (
                      <CarouselImageItem
                        key={index}
                        images={[images[index]]}
                        numberOfImages={1}
                        sx={{ borderRadius: "10px" }}
                      />
                    );
                  })}
              </Carousel>
            </Box>
            {address && (
              <Box>
                <ReactGoogleMap
                  location={address}
                  sx={{ width: "auto", height: "300px" }}
                />
              </Box>
            )}
          </Grid>
        )}

        <Grid item xs={12} md={7} mt={hash ? 3 : 0} mx={hash ? "auto" : 0}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("donor.editDonation.infoForm.title")}
          </Typography>
          {hash && (
            <TextField
              margin="normal"
              fullWidth
              id="title"
              label={t("receiver.editReservation.details.form.id.label")}
              name="title"
              autoFocus
              disabled
              value={matchingDonation?.id}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: `${theme.palette.text.primary}`,
                },
                width: "100%",
              }}
            />
          )}
          {matchingDonation && (
            <DonationDisabledForm donation={matchingDonation} />
          )}

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
        </Grid>
        {!hash && (
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="outlined"
              onClick={handleOpenQRModal}
              sx={{ mr: 5 }}
            >
              {t("receiver.editReservation.openQR")}
            </Button>
            <Stack direction="row">
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
            </Stack>
          </Grid>
        )}
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
