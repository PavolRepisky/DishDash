import { Menu as MenuIcon } from "@mui/icons-material";
import { IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { useSettings } from "../../core/contexts/SettingsProvider";

type AdminToolbarProps = {
  children?: React.ReactNode;
  title?: string;
};

const AdminToolbar = ({ children, title }: AdminToolbarProps) => {
  const { toggleDrawer } = useSettings();
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        px: { xs: 3, sm: 6 },
        background: theme.palette.background.default,
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer}
        sx={{
          display: { lg: "none" },
          marginRight: 2,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h2" component="h1" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {children}
    </Toolbar>
  );
};

export default AdminToolbar;
