import { Modal, Fade, Box, Backdrop, useTheme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import React, { useRef } from "react";




interface QRCodeModalProps {
  open: boolean,
  handleClose: () => void,
  hashedReservation: string
}


const QRCodeModal = ({
  open,
  handleClose,
  hashedReservation
}: QRCodeModalProps) => {

  const theme = useTheme();
  const { t, i18n } = useTranslation();

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
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      width: "90%"
    }
  };

  const handleOnClick = (e: React.MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "QRCode-reservation.png";
    link.href = dataURL;
    link.click();
  }

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
          <Typography component="h2" variant="h3" >
            {t("receiver.reservationDetails.qrCode")}
          </Typography>
          <Typography
            component="h2"
            variant="body1"
            sx={{ mb: 5 }}
            color="text.secondary"
          >
            {t("receiver.reservationDetails.qrCodeMessage")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden", ":hover": { cursor: "pointer" } }}>
            <QRCodeCanvas value={hashedReservation} bgColor={theme.palette.background.default} size={350} onClick={handleOnClick} />
          </Box>
        </Box>
      </Fade>
    </Modal>)
}

export default QRCodeModal;