import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Extra {
  heading: string;
  text: string
}

interface ArticleCardProps {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  actionText: string;
  actionTextAlt: string;
  currentPage?: number;
  extras?: Array<Extra>;
}

const ArticleCard = ({
  id,
  title,
  text,
  imageUrl,
  imageAlt,
  actionText,
  actionTextAlt,
  currentPage,
  extras
}: ArticleCardProps) => {

  const cardContentRef = useRef<HTMLDivElement>(null);
  const cardActionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const handleOnClick = () => {
    setIsExpanded((prevState) => !prevState);
  }

  useEffect(() => {
    setCardHeight((cardContentRef.current?.getBoundingClientRect().height ?? 0) + (cardActionRef.current?.getBoundingClientRect().height ?? 0));
  }, [isExpanded])

  // collapse all on page change
  useEffect(() => {
    setIsExpanded(false);
  }, [currentPage])

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: (isExpanded) ? cardHeight : "200px",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={3}>
        <Grid item md={4}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              marginTop: "-30px",
            }}
            alt={imageAlt}
            src={imageUrl}
          />
        </Grid>
        <Grid item xs >
          <CardContent
            ref={cardContentRef}
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {text}
            </Typography>

            { isExpanded && extras && extras.map((extra: Extra, i: number) => (
              
              <div key={`extra${i}`}>
                <Typography
                  variant="h5"
                  component="div"
                >
                  { extra.heading }
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  { extra.text}
                </Typography>
              </div>
            ))
            }
            
          </CardContent>
          <CardActions ref={cardActionRef} sx={{ mt: "auto" }}>
            <Button 
              onClick={handleOnClick}
              size="small" 
              variant={ (isExpanded) ? "contained" : "outlined" } 
              sx={{ py: 0, mt: "auto" }}
            >
              {(isExpanded) ? actionTextAlt : actionText}
            </Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

interface ArticleListProps {
  articles: ArticleCardProps[];
  itemsPerPage: number;
}

const ArticleList = ({ articles, itemsPerPage }: ArticleListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastArticle = currentPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Grid container gap={3}>
        {currentArticles.map((article, index) => (
          <Grid item xs={12} key={index}>
            <ArticleCard
              id={article.id}
              title={article.title}
              text={article.text}
              imageUrl={article.imageUrl}
              imageAlt={article.imageAlt}
              actionText={article.actionText}
              actionTextAlt={article.actionTextAlt}
              currentPage={currentPage}
              extras={article.extras}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "right", marginTop: 3 }}>
        {Array.from(
          { length: Math.ceil(articles.length / itemsPerPage) },
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
    </>
  );
};

export default ArticleList;
