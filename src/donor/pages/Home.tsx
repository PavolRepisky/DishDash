import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useAuth } from "../../auth/contexts/AuthProvider";
import CardCarousel from "../../core/components/CardCarousel";
import RecentNotifications from "../../core/components/RecentNotifications";
import RotatingNavButton from "../../core/components/RotatingNavButton";
import articles from "../../mocks/articles.json";
import donations from "../../mocks/donations.json";
import events from "../../mocks/events.json";
import ArticleList from "../components/ArticleList";
import DonationModal from "../components/DonationModal";
import { Donation } from "../types/Donation";

const Home = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDonationVisible, setIsDonationVisible] = useState(false);
  const [modalId, setModalId] = useState("");

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.up(450));
  const sm = useMediaQuery(theme.breakpoints.up(840));
  const md = useMediaQuery(theme.breakpoints.up(1100));
  const l = useMediaQuery(theme.breakpoints.up(1300));
  const xl = useMediaQuery(theme.breakpoints.up(1920));

  const compareDonations = (donation1: Donation, donation2: Donation) => {
    const date1 = new Date(donation1.createdAt ?? "").getDate();
    const date2 = new Date(donation2.createdAt ?? "").getDate();
    return Number(date1) - Number(date2);
  };

  const handleRepeatDonation = (donationId: string) => {
    navigate(`/${process.env.PUBLIC_URL}/donor/donations/repeat/${donationId}`);
  };

  const handleEventSelect = (id: String) => {
    navigate(`/${process.env.PUBLIC_URL}/donor/event/${id}`);
  };

  const handleArticleSelect = (id: String) => {
    navigate(`/${process.env.PUBLIC_URL}/donor/article/${id}`)
  }

  const activeDonationsData = donations
    .filter((donation) => donation.active)
    .map((donation) => ({
      title: donation.title,
      location: donation.location,
      imageUrl: donation.imageUrl,
      primaryActionText: t("donor.home.activeDonations.action"),
      primaryAction: () => handleOpenDonationModal(donation.id),
      secondaryActionText: t("donor.home.activeDonations.actionAlt"),
      secondaryAction: () => handleRepeatDonation(donation.id),
    }));

  const recentFulfilledDonationsData = donations
    .filter((donation) => !donation.active)
    .sort(compareDonations)
    .slice(0, 10)
    .map((donation) => ({
      title: donation.title,
      location: donation.location,
      imageUrl: donation.imageUrl,
      primaryActionText: t("donor.home.fulfilledDonations.action"),
      primaryAction: () => handleOpenDonationModal(donation.id),
      secondaryActionText: t("donor.home.fulfilledDonations.actionAlt"),
      secondaryAction: () => handleRepeatDonation(donation.id),
    }));

  const eventData = events.map((event) => ({
    title: event.title,
    location: event.location,
    imageAlt: event.imageAlt,
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

  const handleOpenDonationModal = (id: string) => {
    setModalId(id);
    setIsDonationVisible(true);
  };
  const handleCloseDonationModal = () => setIsDonationVisible(false);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>

      <DonationModal
        open={isDonationVisible}
        handleClose={handleCloseDonationModal}
        id={modalId}
      />

      <Typography component="div" variant="h1" sx={{ mb: 2 }}>
        {t("donor.home.welcome.title", { name: userInfo?.firstName })}
      </Typography>
      <Typography component="div" sx={{ fontWeight: 300, mb: 3 }} variant="h3">
        {t("donor.home.welcome.subTitle")}
      </Typography>
      <RotatingNavButton
        buttonText={t("donor.home.welcome.cta")}
        to={`/${process.env.PUBLIC_URL}/donor/donations/new`}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.activeDonations.title")}
      </Typography>
      <CardCarousel
        variant="regular"
        cards={activeDonationsData}
        cardsPerPage={xl ? 6 : l ? 5 : md ? 4 : sm ? 3 : xs ? 2 : 1}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.fulfilledDonations.title")}
      </Typography>
      <CardCarousel
        variant="regular"
        cards={recentFulfilledDonationsData}
        cardsPerPage={xl ? 6 : l ? 5 : md ? 4 : sm ? 3 : xs ? 2 : 1}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.upcomingEvents.title")}
      </Typography>
      <CardCarousel
        variant="regular"
        cards={eventData}
        cardsPerPage={xl ? 4 : l ? 3 : sm ? 2 : xs ? 1 : 1}
      />

      <Typography component="div" variant="h2" sx={{ mt: 10, mb: 3 }}>
        {t("donor.home.community.title")}
      </Typography>
      <ArticleList articles={articleData} itemsPerPage={3} />
    </>
  );
};

export default Home;
