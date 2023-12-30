import {
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
} from "@mui/material";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { notificationKeys } from "../../admin/config/notification";
import { useNotifications } from "../../donor/hooks/useNotifications";
import { useDateLocale } from "../hooks/useDateLocale";
import Empty from "./Empty";
import Loader from "./Loader";
import Result from "./Result";

const RecentNotifications = () => {
  const locale = useDateLocale();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data, isError, isLoading } = useNotifications();

  const open = Boolean(anchorEl);

  const unreadCount = useMemo(
    () => data && data.filter((notification) => notification.unread).length,
    [data]
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        id="notifications-button"
        aria-controls={t("common.header.notifications.ariaControls")}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
        aria-label={t("common.header.notifications.ariaLabel")}
        color="inherit"
        onClick={handleClick}
      >
        <Badge color="error" variant="dot" invisible={!unreadCount}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id="notifications-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 360 }}>
          {!isLoading && !isError && data && data.length > 0 && (
            <List
              component="nav"
              aria-label={t("common.header.notifications.ariaControls")}
              sx={{ p: 2 }}
            >
              {data.map((notification) => (
                <ListItem
                  button
                  component={NavLink}
                  key={notification.id}
                  to={""}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <InventoryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Trans
                        components={{ bold: <strong /> }}
                        defaults="<bold>{{ user }}</bold> did someting <bold>{{ quantity }}</bold> times"
                        i18nKey={notificationKeys[notification.code]}
                        values={notification.params}
                      />
                    }
                    secondary={formatDistanceToNow(
                      new Date(notification.createdAt),
                      { addSuffix: true, locale }
                    )}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {!isLoading && !isError && (!data || data.length === 0) && (
            <Empty title={t("common.header.notifications.empty.title")} />
          )}
          {isError && (
            <Result
              status="error"
              subTitle={t("common.errors.unexpected.subTitle")}
              title={t("common.errors.unexpected.title")}
            />
          )}
          {isLoading && <Loader />}
        </Box>
      </Popover>
    </Box>
  );
};

export default RecentNotifications;
