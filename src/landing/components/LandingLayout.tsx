import { Login as LoginIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Link as RouterLink } from "react-router-dom";
import Footer from "../../core/components/Footer";
import Logo from "../../core/components/Logo";

type LandingLayoutProps = {
  children: React.ReactNode;
};

const landingNavItems = [
  {
    key: "landing.nav.howItWorks",
    path: "/#howItWorks",
  },
  {
    key: "landing.nav.aboutUs",
    path: "./information",
  },
  {
    key: "landing.nav.community",
    path: "./password",
  },
];

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const { t } = useTranslation();

  return (
    <Paper square>
      <AppBar color="transparent" position="relative">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <Box
              component={RouterLink}
              to={`/${process.env.PUBLIC_URL}`}
              sx={{
                display: "flex",
                alignItems: "center",
                mt: -2,
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <Logo size={24} sx={{ mr: 1 }} />
              <Typography variant="h6" color="inherit" noWrap sx={{ mt: -0.5 }}>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Box>

            <Tabs aria-label="profile nav tabs" value={false}>
              {landingNavItems.map((item) => (
                <Tab
                  key={item.key}
                  activeClassName="Mui-selected"
                  end={true}
                  component={NavLink}
                  label={t(item.key)}
                  to={item.path}
                />
              ))}
            </Tabs>

            <Button
              component={RouterLink}
              to={`/${process.env.PUBLIC_URL}/login`}
              variant="contained"
              startIcon={<LoginIcon />}
            >
              {t("landing.nav.cta")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main">{children}</Box>

      <Footer />
    </Paper>
  );
};

export default LandingLayout;
