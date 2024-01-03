import {
  Coffee as CoffeeIcon,
  Egg as EggIcon,
  LocalPizza as LocalPizzaIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import { Donation } from "../../donor/types/Donation";
import { DonationItem } from "../../donor/types/DonationItem";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

interface ReservationModalProps {
  open: boolean;
  handleClose: () => void;
  id: string;
  onClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "25px",
  p: 4,
};

const ReservationModal = ({
  open,
  handleClose,
  id,
  onClose,
}: ReservationModalProps) => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<DonationItem[]>([]);
  const theme = useTheme();
  const { data: allDonations } = useDonations();
  const { data: allReservations } = useReservations();
  const reservation = allReservations?.find(
    (reservation) => reservation.id === id
  );
  const donation = allDonations?.find(
    (donation: Donation) => donation.id === reservation?.donationId
  );
  const navigate = useNavigate();
  const { deleteReservations, isDeleting } = useDeleteReservations();
  const snackbar = useSnackbar();
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

  const handleEditReservation = () => {
    navigate(`/${process.env.PUBLIC_URL}/receiver/reservations/edit/${id}`);
  };

  const handleCloseConfirmCancelDialog = () => {
    setOpenConfirmCancelDialog(false);
  };

  const handleOpenConfirmCancelDialog = () => {
    setOpenConfirmCancelDialog(true);
  };

  const handleCancelReservation = async () => {
    try {
      await deleteReservations([id]);
      snackbar.success(t("receiver.home.notifications.cancelSuccess"));
      setOpenConfirmCancelDialog(false);
      onClose();
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)} ${date.toLocaleTimeString(
      i18n.language
    )}`;
  };

  const textFieldStyle = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: `${theme.palette.text.primary}`,
    },
  };

  useEffect(() => {
    if (reservation && donation) {
      let reservedItems = reservation.items.map((reservedItem) => {
        const donationItem = donation.items.find(
          (item) => item.id === reservedItem.id
        );

        return {
          ...donationItem,
          name: donationItem?.name ?? "",
          type: donationItem?.type ?? "",
          unit: donationItem?.unit ?? "",
          quantity: reservedItem.quantity,
        };
      });
      setItems(reservedItems);
    }
  }, [donation, reservation]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
                {t("donor.editDonation.infoForm.title")}
              </Typography>

              <Box>
                <TextField
                  margin="normal"
                  fullWidth
                  id="title"
                  label={t("donor.editDonation.infoForm.donationTitle.label")}
                  placeholder={t(
                    "donor.editDonation.infoForm.donationTitle.placeholder"
                  )}
                  name="title"
                  autoFocus
                  disabled
                  sx={textFieldStyle}
                  value={donation?.title}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="location"
                  label={t("donor.editDonation.infoForm.location.label")}
                  placeholder={t(
                    "donor.editDonation.infoForm.location.placeholder"
                  )}
                  name="location"
                  disabled
                  sx={textFieldStyle}
                  value={donation?.location}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="availableFrom"
                  label={t("donor.editDonation.infoForm.from.label").slice(
                    0,
                    -1
                  )}
                  name="availableFrom"
                  disabled
                  sx={textFieldStyle}
                  value={formatDate(donation?.from ?? "")}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="availableUntil"
                  label={t("donor.editDonation.infoForm.until.label").slice(
                    0,
                    -1
                  )}
                  name="availableUbtil"
                  disabled
                  sx={textFieldStyle}
                  value={formatDate(donation?.until ?? "")}
                />

                {donation?.additionalInfo && (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="additionalInfo"
                    label={t(
                      "donor.editDonation.infoForm.additionalInfo.label"
                    )}
                    placeholder={t(
                      "donor.editDonation.infoForm.additionalInfo.placeholder"
                    )}
                    multiline={true}
                    rows={3}
                    name="additionalInfo"
                    disabled
                    sx={textFieldStyle}
                    value={donation?.additionalInfo}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
                {t("donor.editDonation.itemForm.title")}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <List>
                  {items.map((reservationItem, index) => {
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
                        {reservationItem.type === "grocery" && (
                          <ShoppingBagIcon />
                        )}
                        {reservationItem.type === "preparedFood" && (
                          <LocalPizzaIcon />
                        )}
                        {reservationItem.type === "fruitsVegetables" && (
                          <EggIcon />
                        )}
                        {reservationItem.type === "beverages" && <CoffeeIcon />}
                        {reservationItem.type === "petFood" && <PetsIcon />}

                        <ListItemText
                          primary={reservationItem.name}
                          secondary={`${reservationItem.quantity} ${reservationItem.unit}`}
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

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                variant="outlined"
                onClick={handleOpenConfirmCancelDialog}
                sx={{ mr: 1 }}
              >
                {t("common.cancel")}
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
        </Box>
      </Fade>
    </Modal>
  );
};

export default ReservationModal;
