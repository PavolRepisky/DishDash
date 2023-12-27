import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useAuth } from "../../auth/contexts/AuthProvider";
import CardCarousel from "../../core/components/CardCarousel";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import RotatingNavButton from "../../core/components/RotatingNavButton";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import ArticleList from "../../donor/components/ArticleList";
import articles from "../../mocks/articles.json";
import events from "../../mocks/events.json";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

const Home = () => {
  const { userInfo } = useAuth();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [reservationCanceled, setReservationCanceled] = useState<string[]>([]);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.up(450));
  const sm = useMediaQuery(theme.breakpoints.up(840));
  const md = useMediaQuery(theme.breakpoints.up(1100));
  const l = useMediaQuery(theme.breakpoints.up(1300));
  const { deleteReservations, isDeleting } = useDeleteReservations();
  const { data } = useReservations();

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
      setReservationCanceled([]);
      setOpenConfirmCancelDialog(false);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const unpickedReservationsData: any = (data || [])
    .filter((reservation) => reservation.active)
    .map((reservation) => ({
      title: reservation.title,
      description: reservation.location,
      imageAlt: reservation.imageAlt,
      imageUrl: reservation.imageUrl,
      primaryActionText: t("common.view"),
      secondaryActionText: t("common.cancel"),
      secondaryAction: () => handleOpenConfirmCancelDialog(reservation.id),
    }));

  const eventData = events.map((event) => ({
    title: event.title,
    description: event.location,
    imageAlt: event.imageAlt,
    imageUrl: event.imageUrl,
    primaryActionText: t("donor.home.upcomingEvents.action")
  }));

  const articleData = articles.map((article) => ({
    ...article,
    actionText: t("donor.home.community.action"),
    actionTextAlt: t("donor.home.community.actionAlt")
  }));

  return (
    <>
      <AdminAppBar>
        <AdminToolbar></AdminToolbar>
      </AdminAppBar>

      <Typography component="div" variant="h1" sx={{ mb: 2 }}>
        {t("receiver.home.welcome.title", { name: userInfo?.firstName })}
      </Typography>
      <Typography component="div" sx={{ fontWeight: 300, mb: 3 }} variant="h3">
        {t("receiver.home.welcome.subTitle")}
      </Typography>
      <RotatingNavButton
        buttonText={t("receiver.home.welcome.cta")}
        to={`/${process.env.PUBLIC_URL}/donor/donations/new`}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("receiver.home.activeReservations.title")}
      </Typography>
      <CardCarousel
        cards={unpickedReservationsData}
        cardsPerPage={l ? 6 : md ? 6 : sm ? 4 : xs ? 2 : 1}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.upcomingEvents.title")}
      </Typography>
      <CardCarousel cards={eventData} cardsPerPage={3} />

      <Typography component="div" variant="h2" sx={{ mt: 10, mb: 3 }}>
        {t("donor.home.community.title")}
      </Typography>
      <ArticleList articles={articleData} itemsPerPage={3} />

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

export default Home;
