import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";

// Auth
const Login = lazy(() => import("./auth/pages/Login"));
const Register = lazy(() => import("./auth/pages/Register"));
const ForgotPassword = lazy(() => import("./auth/pages/ForgotPassword"));
const ForgotPasswordSubmit = lazy(
  () => import("./auth/pages/ForgotPasswordSubmit")
);

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));

// Landing
const Landing = lazy(() => import("./landing/pages/Landing"));

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

// Reciver
const ReceiverHome = lazy(() => import("./receiver/pages/Home"));
const ReceiverLayout = lazy(
  () => import("./receiver/components/ReceiverLayout")
);
const ReservationManagement = lazy(
  () => import("./receiver/pages/ReservationManagement")
);
const DonationListing = lazy(() => import("./receiver/pages/DonationListing"));


// Routes

const AppRoutes = () => {
  return (
    <Routes basename="/">
      <Route path="/" element={<Landing />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="forgot-password-submit" element={<ForgotPasswordSubmit />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <PrivateRoute path="donor" element={<DonorLayout />} roles={["donor"]}>
        <PrivateRoute path="/" element={<DonorHome />} />
        <PrivateRoute path="faq" element={<Faq />} />
        <PrivateRoute path="help" element={<HelpCenter />} />
        <PrivateRoute path="event/:id" element={<Event />} />

        <PrivateRoute path="profile" element={<Profile />}>
          <PrivateRoute path="/" element={<ProfileActivity />} />
          <PrivateRoute path="information" element={<ProfileInformation />} />
          <PrivateRoute path="password" element={<ProfilePassword />} />
        </PrivateRoute>

        <PrivateRoute path="donations/new" element={<EditDonation />} />
        <PrivateRoute path="donations/edit/:id" element={<EditDonation />} />
        <PrivateRoute path="donations/repeat/:id" element={<EditDonation />} />
        <PrivateRoute path="donations" element={<DonationManagement />} />
      </PrivateRoute>

      <PrivateRoute
        path="receiver"
        element={<ReceiverLayout />}
        roles={["receiver"]}
      >
        <PrivateRoute path="/" element={<ReceiverHome />} />

        <PrivateRoute path="reservations" element={<ReservationManagement />} />
        <PrivateRoute path="donations" element={<DonationListing />} />

        <PrivateRoute path="profile" element={<Profile />}>
          <PrivateRoute path="/" element={<ProfileActivity />} />
          <PrivateRoute path="information" element={<ProfileInformation />} />
          <PrivateRoute path="password" element={<ProfilePassword />} />
        </PrivateRoute>
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
