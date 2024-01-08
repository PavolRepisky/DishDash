import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useAuth } from "../../auth/contexts/AuthProvider";
import CardCarousel from "../../core/components/CardCarousel";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import RotatingNavButton from "../../core/components/RotatingNavButton";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import ArticleList from "../../donor/components/ArticleList";
import { useDonations } from "../../donor/hooks/useDonations";
import articles from "../../mocks/articles.json";
import events from "../../mocks/events.json";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

const Home = () => {
  const { userInfo } = useAuth();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
  const [reservationCanceled, setReservationCanceled] = useState<string[]>([]);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.up(450));
  const sm = useMediaQuery(theme.breakpoints.up(840));
  const md = useMediaQuery(theme.breakpoints.up(1100));
  const l = useMediaQuery(theme.breakpoints.up(1300));
  const xl = useMediaQuery(theme.breakpoints.up(1920));

  const { deleteReservations, isDeleting } = useDeleteReservations();
  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();

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

  const handleEventSelect = (id: String) => {
    navigate(`/${process.env.PUBLIC_URL}/receiver/event/${id}`);
  };

  const handleArticleSelect = (id: String) => { 
    navigate(`/${process.env.PUBLIC_URL}/receiver/article/${id}`);
  };


  const unpickedReservationsData: any = (allReservations || [])
    .filter((reservation) => reservation.active)
    .map((reservation) => {
      const donation = allDonations?.find(
        (donation) => donation.id === reservation.donationId
      );

      return {
        title: donation?.title,
        location: donation?.location,
        imageUrl: donation?.imageUrl,
        primaryActionText: t("common.view"),
        primaryAction: () => handleViewReservation(reservation.id),
        secondaryActionText: t("common.cancel"),
        secondaryAction: () => handleOpenConfirmCancelDialog(reservation.id),
      };
    });

  const eventData = events.map((event) => ({
    title: event.title,
    location: event.location,
    imageUrl: event.imageUrl,
    primaryActionText: t("donor.home.upcomingEvents.action"),
    primaryAction: () => handleEventSelect(event.id),
  }));

  const articleData = articles
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((article) => ({
      ...article,
      action: () => handleArticleSelect(article.id),
      actionText: t("donor.home.community.action"),
      actionTextAlt: t("donor.home.community.actionAlt"),
    }));

  const handleViewReservation = (reservationId: string) => {
    navigate(
      `/${process.env.PUBLIC_URL}/receiver/reservations/${reservationId}`
    );
  };

  return (
    <>
      <AdminAppBar>
        <AdminToolbar />
      </AdminAppBar>

      <Typography component="div" variant="h1" sx={{ mb: 2 }}>
        {t("receiver.home.welcome.title", { name: userInfo?.firstName })}
      </Typography>
      <Typography component="div" sx={{ fontWeight: 300, mb: 3 }} variant="h3">
        {t("receiver.home.welcome.subTitle")}
      </Typography>
      <RotatingNavButton
        buttonText={t("receiver.home.welcome.cta")}
        to={`/${process.env.PUBLIC_URL}/receiver/donations`}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("receiver.home.activeReservations.title")}
      </Typography>
      <CardCarousel
        variant="regular"
        cards={unpickedReservationsData}
        cardsPerPage={xl ? 6 : l ? 5 : md ? 4 : sm ? 3 : xs ? 2 : 1}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.upcomingEvents.title")}
      </Typography>
      <CardCarousel
        variant="regular"
        cards={eventData}
        cardsPerPage={xl ? 6 : l ? 5 : md ? 4 : sm ? 3 : xs ? 2 : 1}
      />

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
