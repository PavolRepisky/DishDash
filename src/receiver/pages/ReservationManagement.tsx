import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useDonations } from "../../donor/hooks/useDonations";
import ReservationTable from "../components/ReservationTable";
import { useDeleteReservations } from "../hooks/useDeleteReservations";
import { useReservations } from "../hooks/useReservations";

const ReservationManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [reservationDeleted, setReservationDeleted] = useState<string[]>([]);
  const { deleteReservations, isDeleting } = useDeleteReservations();
  const { data: allReservations } = useReservations();
  const { data: allDonations } = useDonations();

  const processing = isDeleting;

  const handleDeleteReservations = async () => {
    try {
      await deleteReservations(reservationDeleted);
      snackbar.success(
        t("receiver.reservationManagement.notifications.deleteSuccess")
      );
      setSelected([]);
      setReservationDeleted([]);
      setOpenConfirmDeleteDialog(false);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleEditReservation = (reservationId: string) => {
    navigate(
      `/${process.env.PUBLIC_URL}/receiver/reservations/edit/${reservationId}`
    );
  };

  const handleViewReservation = (reservationId: string) => {
    navigate(
      `/${process.env.PUBLIC_URL}/receiver/reservations/${reservationId}`
    );
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (donationIds: string[]) => {
    setReservationDeleted(donationIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar
            title={t("receiver.reservationManagement.title")}
          ></AdminToolbar>
        ) : (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        )}
      </AdminAppBar>
      <ReservationTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleEditReservation}
        onView={handleViewReservation}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        reservations={allReservations}
        donations={allDonations}
      />
      <ConfirmDialog
        description={t("receiver.reservationsManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteReservations}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />
    </React.Fragment>
  );
};

export default ReservationManagement;
