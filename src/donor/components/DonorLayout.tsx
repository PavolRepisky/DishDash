import {
  Article as ArticleIcon,
  Event as EventIcon,
  HelpCenter as HelpCenterIcon,
  Home as HomeIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from "@mui/icons-material";
import { Box, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import QueryWrapper from "../../core/components/QueryWrapper";
import SettingsDrawer from "../../core/components/SettingsDrawer";
import Sidebar from "../../core/components/Sidebar";
import { useSettings } from "../../core/contexts/SettingsProvider";

const menuItems = [
  {
    icon: HomeIcon,
    key: "donor.drawer.menu.home",
    path: "/donor",
  },
  {
    icon: VolunteerActivismIcon,
    key: "donor.drawer.menu.donationManagement",
    path: "/donor/donations",
  },
  {
    icon: EventIcon,
    key: "donor.drawer.menu.events",
    path: "/donor/event/0",
  },
  {
    icon: ArticleIcon,
    key: "donor.drawer.menu.articles",
    path: "/donor/article/0",
  },
  {
    icon: HelpCenterIcon,
    key: "donor.drawer.menu.help",
    path: "/donor/help",
  },
];

const DonorLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { collapsed, open, toggleDrawer } = useSettings();

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={open}
        onDrawerToggle={toggleDrawer}
        onSettingsToggle={handleSettingsToggle}
        menuItems={menuItems}
      />
      <SettingsDrawer
        onDrawerToggle={handleSettingsToggle}
        open={settingsOpen}
      />
      <Box component="main" sx={{ flexGrow: 1, pb: 3, px: { xs: 3, sm: 6 } }}>
        <Toolbar />
        <QueryWrapper>
          <Outlet />
        </QueryWrapper>
      </Box>
    </Box>
  );
};

export default DonorLayout;
