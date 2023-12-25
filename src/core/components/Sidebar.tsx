import {
  Person as PersonIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink, Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { drawerCollapsedWidth, drawerWidth } from "../config/layout";
import Logo from "./Logo";
import { useEffect } from "react";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsToggle: () => void;
  menuItems: { icon: any; key: string; path: string }[];
};

const Sidebar = ({
  collapsed,
  mobileOpen,
  onDrawerToggle,
  onSettingsToggle,
  menuItems,
}: SidebarProps) => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();

  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  useEffect(() => {
    const eventsBtn = document.getElementsByClassName("events420")[0] as HTMLElement;
    if (pathname.includes("/donor/event")) {
      console.log("triggered useffect");
      eventsBtn.classList.add("Mui-selected");    
    } else {
      eventsBtn.classList.remove("Mui-selected");
    }
  })

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <IconButton
        component={RouterLink}
        to={"/admin"}
        sx={{
          "&:hover": { background: "transparent" },
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          color: theme.palette.text.primary,
        }}
      >
        <Logo />
      </IconButton>

      <List component="nav" sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            component={NavLink}
            key={item.path}
            className={item.path === "/donor/event/0" ? "events420" : ""} // tuttifrutti classname hack
            activeClassName="Mui-selected"
            end={true}
            to={`/${process.env.PUBLIC_URL}${item.path}`}
            sx={{ my: 1 }}
          >
            <ListItemAvatar>
              <Avatar sx={{ color: "inherit", bgcolor: "transparent" }}>
                <item.icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t(item.key)}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List component="nav" sx={{ p: 2 }}>
        <ListItem
          button
          component={NavLink}
          to={`/${process.env.PUBLIC_URL}/${
            userInfo?.role.includes("donor") ? "donor" : "receiver"
          }/profile`}
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={`${userInfo.firstName} ${userInfo.lastName}`}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          )}
        </ListItem>
        <ListItem button onClick={onSettingsToggle}>
          <ListItemAvatar>
            <Avatar>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("admin.drawer.menu.settings")}
            sx={{
              display: collapsed ? "none" : "block",
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      aria-label="Admin drawer"
      component="nav"
      sx={{
        width: { lg: width },
        flexShrink: { lg: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
