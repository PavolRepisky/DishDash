import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import RecentNotifications from "../../admin/components/RecentNotifications";
import { useAuth } from "../../auth/contexts/AuthProvider";
import CardCarousel from "../../core/components/CardCarousel";
import RotatingNavButton from "../../core/components/RotatingNavButton";
import articles from "../../mocks/articles.json";
import donations from "../../mocks/donations.json";
import events from "../../mocks/events.json";
import ArticleList from "../components/ArticleList";
import { Donation } from "../types/Donation";

const Home = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const compareDonations = (donation1: Donation, donation2: Donation) => {
    const date1 = new Date(donation1.createdAt ?? "").getDate();
    const date2 = new Date(donation2.createdAt ?? "");
    return Number(date1) - Number(date2);
  };

  const handleRepeatDonation = (donationId: string) => {
    navigate(`/${process.env.PUBLIC_URL}/admin/donations/repeat/${donationId}`);
  };

  const activeDonationsData = donations
    .filter((donation) => donation.active)
    .map((donation) => ({
      title: donation.title,
      description: donation.location,
      imageAlt: donation.imageAlt,
      imageUrl: donation.imageUrl,
      primaryActionText: t("common.view"),
      secondaryActionText: t("common.repeat"),
      secondaryAction: () => handleRepeatDonation(donation.id),
    }));

  const recentFulfilledDonationsData = donations
    .filter((donation) => !donation.active)
    .sort(compareDonations)
    .slice(0, 10)
    .map((donation) => ({
      title: donation.title,
      description: donation.location,
      imageAlt: donation.imageAlt,
      imageUrl: donation.imageUrl,
      primaryActionText: t("common.view"),
      secondaryActionText: t("common.repeat"),
      secondaryAction: () => handleRepeatDonation(donation.id),
    }));

  const eventData = events.map((event) => ({
    title: event.title,
    description: event.location,
    imageAlt: event.imageAlt,
    imageUrl: event.imageUrl,
    primaryActionText: t("donor.home.upcomingEvents.action"),
  }));

  const articleData = articles.map((article) => ({
    ...article,
    actionText: t("donor.home.community.action"),
  }));

  return (
    <>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>
      <Typography component="div" variant="h1" sx={{ mb: 2 }}>
        {t("donor.home.welcome.title", { name: userInfo?.firstName })}
      </Typography>
      <Typography component="div" sx={{ fontWeight: 300, mb: 3 }} variant="h3">
        {t("donor.home.welcome.subTitle")}
      </Typography>
      <RotatingNavButton
        buttonText={t("donor.home.welcome.cta")}
        to={`/${process.env.PUBLIC_URL}/admin/donations/new`}
      />
      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.activeDonations.title")}
      </Typography>
      <CardCarousel cards={activeDonationsData} cardsPerPage={5} />
      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.fulfilledDonations.title")}
      </Typography>
      <CardCarousel cards={recentFulfilledDonationsData} cardsPerPage={5} />
      <Typography component="div" variant="h2" sx={{ mt: 10 }}>
        {t("donor.home.upcomingEvents.title")}
      </Typography>
      <CardCarousel cards={eventData} cardsPerPage={3} />
      <Typography component="div" variant="h2" sx={{ mt: 10, mb: 3 }}>
        {t("donor.home.community.title")}
      </Typography>
      <ArticleList articles={articleData} itemsPerPage={3} />
    </>
  );
};

export default Home;
