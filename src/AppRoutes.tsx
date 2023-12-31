import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";
import PublicRoute from "./core/components/PublicRoute";

// Landing
const Landing = lazy(() => import("./landing/pages/Landing"));

// Auth
const Register = lazy(() => import("./auth/pages/Register"));
const Login = lazy(() => import("./auth/pages/Login"));
const ForgotPassword = lazy(() => import("./auth/pages/ForgotPassword"));
const ForgotPasswordSubmit = lazy(
  () => import("./auth/pages/ForgotPasswordSubmit")
);

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Donor
const DonorLayout = lazy(() => import("./donor/components/DonorLayout"));
const EditDonation = lazy(() => import("./donor/pages/EditDonation"));
const DonationManagement = lazy(
  () => import("./donor/pages/DonationManagement")
);
const Faq = lazy(() => import("./admin/pages/Faq"));
const HelpCenter = lazy(() => import("./admin/pages/HelpCenter"));
const DonorHome = lazy(() => import("./donor/pages/Home"));
const Profile = lazy(() => import("./admin/pages/Profile"));
const ProfileActivity = lazy(() => import("./admin/pages/ProfileActivity"));
const ProfileInformation = lazy(
  () => import("./admin/pages/ProfileInformation")
);
const ProfilePassword = lazy(() => import("./admin/pages/ProfilePassword"));
const Event = lazy(() => import("./core/pages/Event"));
const Article = lazy(() => import("./core/pages/Article"));

// Receiver
const ReceiverHome = lazy(() => import("./receiver/pages/Home"));
const ReceiverLayout = lazy(
  () => import("./receiver/components/ReceiverLayout")
);
const ReservationManagement = lazy(
  () => import("./receiver/pages/ReservationManagement")
);
const DonationListing = lazy(() => import("./receiver/pages/DonationListing"));
const EditReservation = lazy(() => import("./receiver/pages/EditReservation"));
const CreateReservation = lazy(
  () => import("./receiver/pages/CreateReservation")
);
const ReservationDetail = lazy(
  () => import("./receiver/pages/ReservationDetail")
);

// Routes
const AppRoutes = () => {
  return (
    <Routes basename="/">
      <PublicRoute path="/" element={<Landing />} />
      <PublicRoute path="register" element={<Register />} />
      <PublicRoute path="login" element={<Login />} />
      <PublicRoute path="forgot-password" element={<ForgotPassword />} />
      <PublicRoute
        path="forgot-password-submit"
        element={<ForgotPasswordSubmit />}
      />

      <Route path="qr/:hash" element={<ReservationDetail />} />

      <PrivateRoute path="donor" element={<DonorLayout />} roles={["donor"]}>
        <PrivateRoute path="/" element={<DonorHome />} />

        <PrivateRoute path="donations/new" element={<EditDonation />} />
        <PrivateRoute path="donations/edit/:id" element={<EditDonation />} />
        <PrivateRoute path="donations/repeat/:id" element={<EditDonation />} />
        <PrivateRoute path="donations" element={<DonationManagement />} />

        <PrivateRoute path="profile" element={<Profile />}>
          <PrivateRoute path="/" element={<ProfileActivity />} />
          <PrivateRoute path="information" element={<ProfileInformation />} />
          <PrivateRoute path="password" element={<ProfilePassword />} />
        </PrivateRoute>

        <PrivateRoute path="faq" element={<Faq />} />
        <PrivateRoute path="help" element={<HelpCenter />} />
        <PrivateRoute path="event/:id" element={<Event />} />
        <PrivateRoute path="article/:id" element={<Article />} />
      </PrivateRoute>

      <PrivateRoute
        path="receiver"
        element={<ReceiverLayout />}
        roles={["receiver"]}
      >
        <PrivateRoute path="/" element={<ReceiverHome />} />

        <PrivateRoute path="reservations" element={<ReservationManagement />} />
        <PrivateRoute path="donations" element={<DonationListing />} />
        <PrivateRoute path="event/:id" element={<Event />} />
        <PrivateRoute path="article/:id" element={<Article />} />

        <PrivateRoute path="profile" element={<Profile />}>
          <PrivateRoute path="/" element={<ProfileActivity />} />
          <PrivateRoute path="information" element={<ProfileInformation />} />
          <PrivateRoute path="password" element={<ProfilePassword />} />
        </PrivateRoute>

        <PrivateRoute path="reservations/:id" element={<ReservationDetail />} />
        <PrivateRoute
          path="reservations/new/:id"
          element={<CreateReservation />}
        />
        <PrivateRoute
          path="reservations/edit/:id"
          element={<EditReservation />}
        />
      </PrivateRoute>

      <Route path="403" element={<Forbidden />} />
      <Route path="404" element={<NotFound />} />

      <Route
        path="*"
        element={<Navigate to={`/${process.env.PUBLIC_URL}/404`} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
