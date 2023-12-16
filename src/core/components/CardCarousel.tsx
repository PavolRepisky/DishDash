import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface CardCarouselProps {
  cards: Array<{
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    primaryActionText: string;
    secondaryActionText?: string;
    secondaryAction?: () => void;
  }>;
  cardsPerPage: number;
}

const CardCarousel = ({ cards, cardsPerPage }: CardCarouselProps) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const cardRef = useRef<any>(null);

  const handleNext = () => {
    setCurrentPage(
      (prevPage) => (prevPage + 1) % Math.ceil(cards.length / cardsPerPage)
    );
  };

  const handlePrev = () => {
    setCurrentPage(
      (prevPage) =>
        (prevPage - 1 + Math.ceil(cards.length / cardsPerPage)) %
        Math.ceil(cards.length / cardsPerPage)
    );
  };

  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  console.log(cardRef.current);
  console.log(cardRef.current?.offsetWidth);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handlePrev}
          startIcon={<ArrowBack />}
          disabled={currentPage === 0}
        >
          {t("common.carousel.prevPage")}
        </Button>
        <Button
          onClick={handleNext}
          endIcon={<ArrowForward />}
          disabled={currentPage >= Math.ceil(cards.length / cardsPerPage) - 1}
        >
          {t("common.carousel.nextPage")}
        </Button>
      </Box>

      <Slide direction="left" in mountOnEnter unmountOnExit>
        <Grid container spacing={3} justifyContent="left">
          {cards.slice(startIndex, endIndex).map((card, index) => (
            <Grid item key={index} xs={ Math.round(12 / cardsPerPage) }>
              <Card ref={cardRef}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "320px",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={card.imageUrl}
                  alt={card.title}
                />
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
                    width={ '100%' }
                    textOverflow={ 'ellipsis' }
                    sx={{
                      mb: 1,
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: "auto" }}>
                  {card.secondaryAction && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ py: 0, mt: "auto" }}
                      onClick={card.secondaryAction}
                    >
                      {card.secondaryActionText}
                    </Button>
                  )}

                  <Button
                    size="small"
                    variant="contained"
                    sx={{ py: 0, mt: "auto" }}
                  >
                    {card.primaryActionText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Slide>
    </>
  );
};

export default CardCarousel;
