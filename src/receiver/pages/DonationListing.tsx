import { Search as SearchIcon, Tune as TuneIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useDonations } from "../../donor/hooks/useDonations";
import { Donation } from "../../donor/types/Donation";
import DonationList from "../components/DonationList";

const DonationListing = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.up(450));
  const sm = useMediaQuery(theme.breakpoints.up(840));
  const md = useMediaQuery(theme.breakpoints.up(1100));
  const l = useMediaQuery(theme.breakpoints.up(1300));
  const { data } = useDonations();
  const { t } = useTranslation();
  const [distanceFilter, setDistanceFilter] = useState<number>(30000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [fromFilter, setFromFilter] = useState<string | undefined>();
  const [untilFilter, setUntilFilter] = useState<string | undefined>();
  const [filtersOpened, setFiltersOpened] = useState(false);

  const handleCategoryChange = (event: any, newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  const categoryFilter = (donation: Donation) => {
    if (selectedCategories.length === 0 || selectedCategories.includes("all")) {
      return true;
    } else {
      return selectedCategories.some((category) =>
        donation.items.some((item) => item.type === category)
      );
    }
  };

  const handleApplyFilters = () => {
    setDistanceFilter(formik.values.distance);
    setFromFilter(formik.values.from);
    setUntilFilter(formik.values.until);
    setFiltersOpened(false);
  };

  const handleViewDonation = (donationId: string) => {};

  const formik = useFormik({
    initialValues: {
      searchQuery: "",
      from: today.toISOString(),
      until: tomorrow.toISOString(),
      distance: distanceFilter,
    },
    onSubmit: () => {},
  });

  let allDonations = (data || []).map((donation) => ({
    ...donation,
    primaryActionText: t("common.view"),
    secondaryActionText: t("receiver.donationListing.reserve"),
  }));

  const handleSearch = (donations: any, query: string) => {
    query = query.trim().toLowerCase();

    let filteredDonations = donations
      .filter((donation: any) => donation.distance <= distanceFilter)
      .filter(categoryFilter);

    if (query) {
      filteredDonations = filteredDonations.filter(
        (donation: any) =>
          donation.title.toLowerCase().includes(query) ||
          donation.location.toLowerCase().includes(query) ||
          donation.items.some((item: any) =>
            item.name.toLowerCase().includes(query)
          )
      );
    }

    if (fromFilter) {
      filteredDonations = filteredDonations.filter(
        (donation: any) => new Date(donation.from) >= new Date(fromFilter)
      );
    }

    if (untilFilter) {
      filteredDonations = filteredDonations.filter(
        (donation: any) => new Date(donation.until) <= new Date(untilFilter)
      );
    }

    return filteredDonations;
  };

  const activeDonations = handleSearch(
    allDonations.filter((donation) => donation.active),
    formik.values.searchQuery
  );

  return (
    <>
      <AdminAppBar>
        <AdminToolbar></AdminToolbar>
      </AdminAppBar>

      <Typography component="div" variant="h1" sx={{ mb: 3 }}>
        {t("receiver.donationListing.title")}
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", alignItems: "center", mb: 5 }}
      >
        <TextField
          margin="none"
          required
          id="searchQuery"
          placeholder={t("receiver.donationListing.search.placeholder")}
          name="searchQuery"
          value={formik.values.searchQuery}
          onChange={formik.handleChange}
          sx={{ mr: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={() => setFiltersOpened(true)}>
          <TuneIcon />
        </IconButton>
      </Box>

      <Dialog
        open={filtersOpened}
        onClose={() => setFiltersOpened(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogContent>
          <DialogTitle
            id="confirm-dialog-title"
            sx={{ p: 0, fontSize: "1.5rem" }}
          >
            {t("receiver.donationListing.filters.title")}
          </DialogTitle>
          <Box>
            <Slider
              name="distance"
              id="distance"
              value={formik.values.distance}
              onChange={formik.handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="distance-slider"
              min={500}
              max={30000}
              step={500}
              sx={{ maxWidth: "600px" }}
            />
          </Box>

          <Grid container gap={2}>
            <Grid item>
              <Typography component="h2" variant="body1" sx={{ mb: 1, mt: 1 }}>
                {t("receiver.donationListing.filters.from.label")}
              </Typography>
              <Grid item container spacing={1}>
                <Grid item>
                  <DatePicker
                    label={t("receiver.donationListing.filters.date.label")}
                    value={dayjs(formik.values.from)}
                    onChange={(date) => {
                      const updatedDate = new Date(dayjs(date).toDate());
                      const currentDate = new Date(formik.values.from);
                      updatedDate.setHours(
                        currentDate.getHours(),
                        currentDate.getMinutes(),
                        currentDate.getSeconds()
                      );
                      formik.setFieldValue("from", updatedDate.toISOString());
                    }}
                  />
                </Grid>
                <Grid item>
                  <TimePicker
                    label={t("receiver.donationListing.filters.time.label")}
                    value={dayjs(formik.values.from)}
                    onChange={(time) => {
                      const updatedTime = new Date(dayjs(time).toDate());
                      updatedTime.setDate(
                        new Date(formik.values.from).getDate()
                      );
                      formik.setFieldValue("from", updatedTime.toISOString());
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Typography component="h2" variant="body1" sx={{ mb: 1, mt: 1 }}>
                {t("receiver.donationListing.filters.until.label")}
              </Typography>
              <Grid item container spacing={1}>
                <Grid item>
                  <DatePicker
                    label={t("receiver.donationListing.filters.date.label")}
                    value={dayjs(formik.values.until)}
                    onChange={(date) => {
                      const updatedDate = new Date(dayjs(date).toDate());
                      const currentDate = new Date(formik.values.until);
                      updatedDate.setHours(
                        currentDate.getHours(),
                        currentDate.getMinutes(),
                        currentDate.getSeconds()
                      );
                      formik.setFieldValue("until", updatedDate.toISOString());
                    }}
                  />
                </Grid>
                <Grid item>
                  <TimePicker
                    label={t("receiver.donationListing.filters.time.label")}
                    value={dayjs(formik.values.until)}
                    onChange={(time) => {
                      const updatedTime = new Date(dayjs(time).toDate());
                      updatedTime.setDate(
                        new Date(formik.values.until).getDate()
                      );
                      formik.setFieldValue("until", updatedTime.toISOString());
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyFilters} variant="contained">
            {t("common.apply")}
          </Button>
        </DialogActions>
      </Dialog>

      <ToggleButtonGroup
        value={selectedCategories}
        onChange={handleCategoryChange}
        aria-label="Categories"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">
          {t("donor.editDonation.foodTypes.all.label")}
        </ToggleButton>
        <ToggleButton value="preparedFood">
          {t("donor.editDonation.foodTypes.preparedFood.label")}
        </ToggleButton>
        <ToggleButton value="beverages">
          {t("donor.editDonation.foodTypes.beverages.label")}
        </ToggleButton>

        <ToggleButton value="grocery">
          {t("donor.editDonation.foodTypes.grocery.label")}
        </ToggleButton>
        <ToggleButton value="fruitsVegetables">
          {t("donor.editDonation.foodTypes.fruitsVegetables.label")}
        </ToggleButton>
        <ToggleButton value="petFood">
          {t("donor.editDonation.foodTypes.petFood.label")}
        </ToggleButton>
      </ToggleButtonGroup>

      <DonationList
        donations={activeDonations}
        itemsPerPage={20}
        itemsPerRow={l ? 6 : md ? 6 : sm ? 4 : xs ? 2 : 1}
      />
    </>
  );
};

export default DonationListing;
