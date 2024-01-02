import {
  AccountCircle as AccountCircleIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Link as RouterLink } from "react-router-dom";
import Footer from "../../core/components/Footer";
import Logo from "../../core/components/Logo";
import SettingsDrawer from "../../core/components/SettingsDrawer";

type LandingLayoutProps = {
  children: React.ReactNode;
};

const landingNavItems = [
  {
    key: "landing.nav.signUp",
    path: "register",
  },
  {
    key: "landing.nav.howItWorks",
    path: "howItWorks",
  },
  {
    key: "landing.nav.aboutUs",
    path: "aboutUs",
  },
  {
    key: "landing.nav.contact",
    path: "contact",
  },
];

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(null);
  };

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Paper square sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <AppBar color="secondary" position="static" sx={{ mb: 5 }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            {/* Main flex container */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              {/* Logo Container left - hide when display is xs */}
              <Box
                component={RouterLink}
                to={`/${process.env.PUBLIC_URL}`}
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  mt: -2,
                  textDecoration: "none",
                  color: "text.primary",
                }}
              >
                <Logo size={24} sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ mt: -0.5 }}
                >
                  {process.env.REACT_APP_NAME}
                </Typography>
              </Box>

              {/* Hamburger menu - hide when display is md or higher */}
              <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="navigation hamburger menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {landingNavItems.map((item, i) => (
                    <MenuItem
                      key={item.key}
                      onClick={handleCloseNavMenu}
                      component={NavLink}
                      to={
                        i === 0
                          ? `/${process.env.PUBLIC_URL}/${item.path}`
                          : `/${process.env.PUBLIC_URL}/#${item.path}`
                      }
                    >
                      <Typography textAlign="center">{t(item.key)}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Logo Container center - hide when display is md or higher */}
              <Box
                component={RouterLink}
                to={`/${process.env.PUBLIC_URL}`}
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0,
                  textDecoration: "none",
                  color: "text.primary",
                }}
              >
                <Logo size={32} sx={{ mr: 1 }} />
                <Typography variant="h4" color="inherit" noWrap sx={{ mt: 0 }}>
                  {process.env.REACT_APP_NAME}
                </Typography>
              </Box>

              {/* Menu Items - hide when display is extra small */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                }}
              >
                <Tabs aria-label={t("landing.nav.tabsAria")} value={false}>
                  {landingNavItems.map((item, i) => (
                    <Tab
                      key={item.key}
                      activeClassName="Mui-selected"
                      end={true}
                      component={NavLink}
                      label={t(item.key)}
                      to={
                        i === 0
                          ? `/${process.env.PUBLIC_URL}/${item.path}`
                          : `/${process.env.PUBLIC_URL}/#${item.path}`
                      }
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Login and settings buttons */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  component={RouterLink}
                  to={`/${process.env.PUBLIC_URL}/login`}
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{ mr: 1, display: { xs: "none", md: "inline-flex" } }}
                  size="small"
                >
                  {t("landing.nav.cta")}
                </Button>

                <IconButton
                  component={RouterLink}
                  to={`/${process.env.PUBLIC_URL}/login`}
                  sx={{ pr: 0, display: { xs: "inline-flex", md: "none" } }}
                >
                  <AccountCircleIcon />
                </IconButton>

                <IconButton
                  color="default"
                  aria-label={t("landing.nav.settingsAria")}
                  component="span"
                  onClick={handleSettingsToggle}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <SettingsDrawer
        onDrawerToggle={handleSettingsToggle}
        open={settingsOpen}
      />

      <Box component="main" sx={{ px: "5%" }}>
        {children}
      </Box>

      <Footer />
    </Paper>
  );
};

export default LandingLayout;
