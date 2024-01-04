import {
  AccountCircle as AccountCircleIcon
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import articles from "../../mocks/articles.json";
import RecentNotifications from "../components/RecentNotifications";
import BlurredEdgeImage from "../components/BlurredEdgeImage";
import ArticleList from "../../donor/components/ArticleList";
import CardCarousel from "../components/CardCarousel";
import Carousel from "react-material-ui-carousel";
import ArticleImageItem from "../components/ArticleImageItem";

const Article = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const descriptionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down(450), {noSsr: true});

  const newestArticleId = articles.reduce((prev, curr) =>
    Math.abs(Date.parse(curr.createdAt) - Date.now()) <
    Math.abs(Date.parse(prev.createdAt) - Date.now())
      ? curr
      : prev
  ).id;

  console.log(newestArticleId);

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)}`;
  };

  const articleId = id === "0" ? newestArticleId : id;

  const handleArticleSelect = (id: String) => {
    if (pathname.includes("donor")) {
      navigate(`/${process.env.PUBLIC_URL}/donor/article/${id}`);
    } else if (pathname.includes("receiver")) {
      navigate(`/${process.env.PUBLIC_URL}/receiver/article/${id}`);
    }
  };

  const articleData = articles
  .filter((article) => article.id !== articleId)
  .map((article) => ({
    id: article.id,
    title: article.title,
    location: formatDate(article.createdAt),
    imageUrl: article.imageUrl,
    primaryActionText: t("donor.home.community.actionAlt"),
    primaryAction: () => handleArticleSelect(article.id),
  }))
  .sort((a, b) => Date.parse(b.location) - Date.parse(a.location));
  

  const currentArticle = articles.find((article) => article.id === articleId);



  const boxStyle = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    background: `${theme.palette.background.paper}`,
    mb: 10,
    py: "24px",
    borderRadius: "25px",
    boxSizing: "border-box"        
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>

      <Container component={"nav"} disableGutters>
        <Typography component="div" variant="h2" sx={{ mt: 0 }}>
          {t("donor.home.community.browse")}
        </Typography>

        <CardCarousel variant="overlay" cards={articleData} cardsPerPage={xs ? 1 : 3} />
      </Container>


      <Typography
        variant="h3"
        align="center"
        color="text.primary"
        sx={{ mt: 10, mb: 4 }}
      >
        {currentArticle?.title}
      </Typography>
      
      <Container disableGutters>
        <Box  sx={{
          ...boxStyle, 
          borderRadius: "0px", 
          width: "fit-content",
          marginRight: "auto",
          marginBottom: "1em",
          paddingY: "1em",
        }}>
          <Stack direction="row" >
            <Box width="40px" height="40px" ml={2} mr={1}>
              <AccountCircleIcon sx={{ fontSize: "40px" }} />
            </Box>
            <Box>
              <Typography variant="body2" mr={3} fontWeight="medium">{currentArticle?.author}</Typography>
              <Typography variant="body2" mr={3}>{formatDate(currentArticle?.createdAt ?? "")}</Typography>
            </Box>
          </Stack>

        </Box>
      </Container>

      <Container component={"section"} sx={{ ...boxStyle, borderRadius: "0px 25px 0px 25px" }}>
        <Typography variant="body1" mb={3} fontSize="1.1em" >
          {currentArticle?.text}
        </Typography>
        
        { currentArticle?.extras !== undefined && currentArticle.extras.map((article, index) => (
          <div key={`extra${index}`}>
            <Typography variant="h5" mb={1} mt={3}>
              {article.heading}
            </Typography>
            <Typography variant="body1">
              {article.text}
            </Typography>
          </div>
        ))}
      </Container>
      
      <Container disableGutters>
        <Carousel>
          { currentArticle?.imageGallery !== undefined && new Array(Math.floor(currentArticle?.imageGallery?.length / 3)).fill(null).map((_, index) => {

            console.log(index);

            // if (index*3 >= currentArticle?.imageGallery.length) return;

            return (
              <ArticleImageItem key={index} numberOfImages={3} images={currentArticle?.imageGallery.slice((index * 3), (index * 3)+3)}/>
            )
          })}
        </Carousel>
      </Container>

    </>
  );
};

export default Article;
