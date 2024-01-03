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
import DonationModal from "../../donor/components/DonationModal";

interface DonationCardProps {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  imageAlt?: string;
  actionText: string;
  action: (donationId: string) => void;
}

const DonationCard = ({
  id,
  title,
  location,
  imageUrl,
  imageAlt,
  actionText,
  action,
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
        <Button
          size="small"
          variant="contained"
          sx={{ py: 0, mt: "auto" }}
          onClick={() => action(id)}
        >
          {actionText}
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
              actionText={donation.actionText}
              action={() => handleOpenDonationModal(donation.id)}
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
