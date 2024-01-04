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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface CardCarouselProps {
  cards: Array<{
    title: string;
    location: string;
    imageUrl: string;
    primaryActionText?: string;
    primaryAction?: () => void;
    secondaryActionText?: string;
    secondaryAction?: () => void;
  }>;
  variant: "regular" | "overlay";
  cardsPerPage: number;
}

const CardCarousel = ({ variant, cards, cardsPerPage }: CardCarouselProps) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const cardRef = useRef<any>(null);
  const theme = useTheme();

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

  const parseHexColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return [
      r,
      g,
      b
    ]
  }

  const [ bg_r, bg_g, bg_b ] = parseHexColor(theme.palette.background.paper);

  const startIndex = currentPage * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, cards.length);

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
        {variant === "overlay" && <Typography variant="body1" my="auto">Page {currentPage+1}/{Math.floor(cards.length / cardsPerPage) + 1}</Typography>}
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
            <Grid
              item
              key={index}
              xs={12 / Math.min(cardsPerPage, endIndex - startIndex)}
            >
              {variant === "overlay" && <Card
                ref={cardRef}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "160px",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={card.imageUrl}
                  alt={card.title}
                  sx={{
                    position: "absolute"
                  }}
                />

                <CardContent
                  sx={{
                    position: "absolute",
                    width: "100%",
                    paddingX: "0",
                    paddingTop: "0",
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Box sx={{
                    // padding: "1em",
                    px: "24px",
                    paddingTop: "24px",
                    paddingBottom: "8px",
                    width: "100%",
                    background: `rgba(${bg_r}, ${bg_g}, ${bg_b}, 0.7)`,
                  }}>
                    <Tooltip title={card.title}>
                      <Typography
                        variant="h5"
                        component="div"
                        noWrap
                        width={"100%"}
                        textOverflow={"ellipsis"}
                        sx={{
                          mb: 1,
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Tooltip>

                    <Tooltip title={card.location}>
                      <Typography
                        variant="body2"
                        component="div"
                        noWrap
                        width={"100%"}
                        textOverflow={"ellipsis"}
                        color="text.secondary"
                        sx={{
                          mb: 1,
                        }}
                      >
                        {card.location}
                      </Typography>
                    </Tooltip>
                  </Box>

                </CardContent>

                <CardActions sx={{ mt: "auto", justifyContent: "start" }}>
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
                    onClick={card.primaryAction}
                  >
                    {card.primaryActionText}
                  </Button>
                </CardActions>
              </Card>}
              {variant === "regular" && <Card
                ref={cardRef}
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
                  <Tooltip title={card.title}>
                    <Typography
                      variant="h5"
                      component="div"
                      noWrap
                      width={"100%"}
                      textOverflow={"ellipsis"}
                      sx={{
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Tooltip>

                  <Tooltip title={card.location}>
                    <Typography
                      variant="body2"
                      component="div"
                      noWrap
                      width={"100%"}
                      textOverflow={"ellipsis"}
                      color="text.secondary"
                      sx={{
                        mb: 1,
                      }}
                    >
                      {card.location}
                    </Typography>
                  </Tooltip>
                </CardContent>

                <CardActions sx={{ mt: "auto", justifyContent: "start" }}>
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
                    onClick={card.primaryAction}
                  >
                    {card.primaryActionText}
                  </Button>
                </CardActions>
              </Card>}
            </Grid>
          ))}
        </Grid>
      </Slide>
    </>
  );
};

export default CardCarousel;
