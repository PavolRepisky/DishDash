import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import DonationModal from "../../donor/components/DonationModal";

interface DonationCardProps {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  imageAlt?: string;
  primaryActionText: string;
  primaryAction: (donationId: string) => void;
  secondaryActionText: string;
  secondaryAction: (donationId: string) => void;
}

const DonationCard = ({
  id,
  title,
  location,
  imageUrl,
  imageAlt,
  primaryActionText,
  primaryAction,
  secondaryActionText,
  secondaryAction,
}: DonationCardProps) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "320px",
        overflow: "hidden",
      }}
    >
      <CardMedia component="img" height="180" image={imageUrl} alt={imageAlt} />
      <CardContent
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          noWrap
          width={"100%"}
          textOverflow={"ellipsis"}
          sx={{
            mb: 1,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {location}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: "auto", justifyContent: "start" }}>
        {secondaryAction && (
          <Button
            size="small"
            variant="outlined"
            sx={{ py: 0, mt: "auto" }}
            onClick={() => secondaryAction(id)}
          >
            {secondaryActionText}
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          sx={{ py: 0, mt: "auto" }}
          onClick={() => primaryAction(id)}
        >
          {primaryActionText}
        </Button>
      </CardActions>
    </Card>
  );
};

interface DonationListProps {
  donations: DonationCardProps[];
  itemsPerPage: number;
  itemsPerRow: number;
}

const DonationList = ({
  donations,
  itemsPerPage,
  itemsPerRow,
}: DonationListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDonationVisible, setIsDonationVisible] = useState(false);
  const [modalId, setModalId] = useState("");
  const navigate = useNavigate();

  const indexOfLastDonation = currentPage * itemsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - itemsPerPage;
  const currentDonations = donations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDonationModal = (id: string) => {
    setModalId(id);
    setIsDonationVisible(true);
  };
  const handleCloseDonationModal = () => setIsDonationVisible(false);

  const handleReserveDonation = (id: string) => {
    navigate(`/${process.env.PUBLIC_URL}/receiver/reservations/new/${id}`);
  };

  return (
    <>
      <Grid container gap={3} justifyContent="left">
        {currentDonations.map((donation, index) => (
          <Grid item xs={12 / itemsPerRow} key={index}>
            <DonationCard
              id={donation.id}
              title={donation.title}
              location={donation.location}
              imageUrl={donation.imageUrl}
              imageAlt={donation.imageAlt}
              primaryActionText={donation.primaryActionText}
              primaryAction={() => handleOpenDonationModal(donation.id)}
              secondaryActionText={donation.secondaryActionText}
              secondaryAction={() => handleReserveDonation(donation.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "right", marginTop: 3 }}>
        {Array.from(
          { length: Math.ceil(donations.length / itemsPerPage) },
          (_, index) => (
            <Button
              key={index}
              size="small"
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
              color="primary"
              sx={{ py: 0, ml: 1 }}
            >
              {index + 1}
            </Button>
          )
        )}
      </Box>

      <DonationModal
        open={isDonationVisible}
        handleClose={handleCloseDonationModal}
        id={modalId}
        reserve={true}
      />
    </>
  );
};

export default DonationList;
