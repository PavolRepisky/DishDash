import {
  Coffee as CoffeeIcon,
  Delete as DeleteIcon,
  Egg as EggIcon,
  LocalPizza as LocalPizzaIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useCreateDonation } from "../hooks/useCreateDonation";
import { useDonations } from "../hooks/useDonations";
import { useUpdateDonation } from "../hooks/useUpdateDonation";
import { Donation } from "../types/Donation";
import { DonationItem } from "../types/DonationItem";

const foodTypes = [
  {
    label: "donor.editDonation.foodTypes.grocery.label",
    value: "grocery",
  },
  {
    label: "donor.editDonation.foodTypes.preparedFood.label",
    value: "preparedFood",
  },
  {
    label: "donor.editDonation.foodTypes.fruitsVegetables.label",
    value: "fruitsVegetables",
  },
  {
    label: "donor.editDonation.foodTypes.beverages.label",
    value: "beverages",
  },
  {
    label: "donor.editDonation.foodTypes.petFood.label",
    value: "petFood",
  },
];

const units = [
  {
    label: "donor.editDonation.units.grams.label",
    value: "g",
  },
  {
    label: "donor.editDonation.units.kilograms.label",
    value: "kg",
  },
  {
    label: "donor.editDonation.units.liters.label",
    value: "l",
  },
  {
    label: "donor.editDonation.units.deciliters.label",
    value: "dl",
  },
  {
    label: "donor.editDonation.units.milliliters.label",
    value: "ml",
  },
  {
    label: "donor.editDonation.units.pieces.label",
    value: "pc",
  },
];

const EditDonation = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [items, setItems] = useState<DonationItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [itemsStatus, setItemsStatus] = useState("");
  const { createDonation, isCreating } = useCreateDonation();
  const { updateDonation, isUpdating } = useUpdateDonation();
  const theme = useTheme();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { data } = useDonations();
  const donation = data?.find((donation) => donation.id === id);

  useEffect(() => {
    if (donation) {
      setItems(donation.items);
    }
  }, [donation]);

  const processing = isCreating || isAdding || isUpdating;

  const itemValidationSchema = Yup.object({
    name: Yup.string().required(t("common.validations.required")),
    quantity: Yup.number()
      .min(1, t("common.validations.invalid"))
      .required(t("common.validations.required")),
    type: Yup.string().required(t("common.validations.required")),
    unit: Yup.string().required(t("common.validations.required")),
  });

  type ItemFormData = Yup.InferType<typeof itemValidationSchema>;

  const handleAddItem = (newItem: ItemFormData) => {
    setIsAdding(true);
    const existingItem = items.find((item) => item.name === newItem.name);

    if (existingItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.name === existingItem.name ? newItem : item
        )
      );
    } else {
      setItems((prevItems) => [...prevItems, newItem as DonationItem]);
    }
    setIsAdding(false);
    setItemsStatus("");
    itemFormik.resetForm();
  };

  const handleRemoveItem = (name: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };

  const itemFormik = useFormik({
    initialValues: {
      name: "",
      quantity: 0,
      type: "grocery",
      unit: "g",
    },
    validationSchema: itemValidationSchema,
    onSubmit: handleAddItem,
  });

  const infoValidationSchema = Yup.object({
    title: Yup.string().required(t("common.validations.required")),
    location: Yup.string().required(t("common.validations.required")),
    from: Yup.string().required(t("common.validations.required")),
    until: Yup.string().required(t("common.validations.required")),
    additionalInfo: Yup.string(),
  });

  type InfoFormData = Yup.InferType<typeof infoValidationSchema>;

  const handleSubmit = (infoData: InfoFormData) => {
    if (items.length === 0) {
      setItemsStatus(t("donor.editDonation.noItems"));
      return;
    }
    if (donation) {
      handleUpdateDonation(infoData);
      return;
    }
    handleAddDonation(infoData);
  };

  const handleAddDonation = async (infoData: InfoFormData) => {
    console.log("add called");
    try {
      const donationData = { ...infoData, items };
      await createDonation(donationData as Donation);
      snackbar.success(
        t("donor.createDonation.notifications.createSuccess", {
          donation: infoData.title,
        })
      );
      navigate(`/${process.env.PUBLIC_URL}/admin/donations`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const handleUpdateDonation = async (infoData: InfoFormData) => {
    try {
      const donationData = { ...infoData, items };
      await updateDonation({ ...donationData, id });
      snackbar.success(
        t("donor.editDonation.notifications.updateSuccess", {
          donation: infoData.title,
        })
      );
      navigate(`/${process.env.PUBLIC_URL}/admin/donations`);
    } catch (err: any) {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    }
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const infoFormik = useFormik({
    initialValues: {
      title: donation?.title ?? "",
      location: donation?.location ?? "",
      from: donation?.from ?? today.toISOString(),
      until: donation?.until ?? tomorrow.toISOString(),
      additionalInfo: donation?.additionalInfo ?? "",
    },
    validationSchema: infoValidationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <AdminAppBar>
        <AdminToolbar
          title={
            donation
              ? t("donor.editDonation.title")
              : t("donor.createDonation.title")
          }
        ></AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("donor.editDonation.infoForm.title")}
          </Typography>

          <Box component="form" noValidate onSubmit={infoFormik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label={t("donor.editDonation.infoForm.donationTitle.label")}
              name="title"
              autoFocus
              disabled={processing}
              value={infoFormik.values.title}
              onChange={infoFormik.handleChange}
              error={
                infoFormik.touched.title && Boolean(infoFormik.errors.title)
              }
              helperText={infoFormik.touched.title && infoFormik.errors.title}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label={t("donor.editDonation.infoForm.location.label")}
              name="location"
              disabled={processing}
              value={infoFormik.values.location}
              onChange={infoFormik.handleChange}
              error={
                infoFormik.touched.location &&
                Boolean(infoFormik.errors.location)
              }
              helperText={
                infoFormik.touched.location && infoFormik.errors.location
              }
            />

            <Typography
              component="h2"
              variant="body2"
              sx={{ mb: 1, mt: 1 }}
              color="text.secondary"
            >
              {t("donor.editDonation.infoForm.from.label")}
            </Typography>
            <Grid container spacing={1} marginTop={1}>
              <Grid item xs>
                <DatePicker
                  label={t("donor.editDonation.infoForm.from.date")}
                  value={dayjs(infoFormik.values.from)}
                  onChange={(date) => {
                    const updatedDate = new Date(dayjs(date).toDate());
                    const currentDate = new Date(infoFormik.values.from);
                    updatedDate.setHours(
                      currentDate.getHours(),
                      currentDate.getMinutes(),
                      currentDate.getSeconds()
                    );
                    infoFormik.setFieldValue("from", updatedDate.toISOString());
                  }}
                  disabled={processing}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("donor.editDonation.infoForm.from.time")}
                  value={dayjs(infoFormik.values.from)}
                  onChange={(time) => {
                    const updatedTime = new Date(dayjs(time).toDate());
                    updatedTime.setDate(
                      new Date(infoFormik.values.from).getDate()
                    );
                    infoFormik.setFieldValue("from", updatedTime);
                  }}
                  disabled={processing}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>

            <Typography
              component="h2"
              variant="body2"
              sx={{ mb: 1, mt: 2 }}
              color="text.secondary"
            >
              {t("donor.editDonation.infoForm.until.label")}
            </Typography>
            <Grid container spacing={1} marginTop={1}>
              <Grid item xs>
                <DatePicker
                  label={t("donor.editDonation.infoForm.until.date")}
                  value={dayjs(infoFormik.values.until)}
                  onChange={(date) => {
                    const updatedDate = new Date(dayjs(date).toDate());
                    const currentDate = new Date(infoFormik.values.until);
                    updatedDate.setHours(
                      currentDate.getHours(),
                      currentDate.getMinutes(),
                      currentDate.getSeconds()
                    );
                    infoFormik.setFieldValue(
                      "until",
                      updatedDate.toISOString()
                    );
                  }}
                  disabled={processing}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs>
                <TimePicker
                  label={t("donor.editDonation.infoForm.until.time")}
                  value={dayjs(infoFormik.values.until)}
                  onChange={(time) => {
                    const updatedTime = new Date(dayjs(time).toDate());
                    updatedTime.setDate(
                      new Date(infoFormik.values.until).getDate()
                    );
                    infoFormik.setFieldValue("until", updatedTime);
                  }}
                  disabled={processing}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              id="additionalInfo"
              label={t("donor.editDonation.infoForm.additionalInfo.label")}
              name="additionalInfo"
              disabled={processing}
              value={infoFormik.values.additionalInfo}
              onChange={infoFormik.handleChange}
              error={
                infoFormik.touched.additionalInfo &&
                Boolean(infoFormik.errors.additionalInfo)
              }
              helperText={
                infoFormik.touched.additionalInfo &&
                infoFormik.errors.additionalInfo
              }
            />

            <Box textAlign="right" marginTop={3}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={processing}
                loading={processing || isAdding}
              >
                {donation
                  ? t("donor.editDonation.infoForm.submit")
                  : t("donor.createDonation.submit")}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h3" sx={{ mb: 1 }}>
            {t("donor.editDonation.itemForm.title")}
          </Typography>

          <FormHelperText
            error={Boolean(itemsStatus)}
            component="h1"
            sx={{ mb: 1 }}
          >
            <Typography variant="body1">{itemsStatus}</Typography>
          </FormHelperText>

          <Box
            component="form"
            noValidate
            onSubmit={itemFormik.handleSubmit}
            sx={{ mb: 1 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label={t("donor.editDonation.itemForm.name.label")}
                  name="name"
                  disabled={processing}
                  value={itemFormik.values.name}
                  onChange={itemFormik.handleChange}
                  error={
                    itemFormik.touched.name && Boolean(itemFormik.errors.name)
                  }
                  helperText={itemFormik.touched.name && itemFormik.errors.name}
                />
              </Grid>
              <Grid item xs={2}>
                <FormControl
                  component="fieldset"
                  margin="normal"
                  sx={{ maxWidth: "100%", width: "100%" }}
                >
                  <InputLabel id="typeLabel">
                    {t("donor.editDonation.itemForm.type.label")}
                  </InputLabel>
                  <Select
                    labelId="typeLabel"
                    id="type"
                    name="type"
                    required
                    value={itemFormik.values.type}
                    label={t("donor.editDonation.itemForm.type.label")}
                    onChange={itemFormik.handleChange}
                  >
                    {foodTypes.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {t(type.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="number"
                  id="quantity"
                  label={t("donor.editDonation.itemForm.quantity.label")}
                  name="quantity"
                  disabled={processing}
                  value={itemFormik.values.quantity}
                  onChange={itemFormik.handleChange}
                  error={
                    itemFormik.touched.quantity &&
                    Boolean(itemFormik.errors.quantity)
                  }
                  helperText={
                    itemFormik.touched.quantity && itemFormik.errors.quantity
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <FormControl
                  component="fieldset"
                  margin="normal"
                  sx={{ maxWidth: "100%", width: "100%" }}
                >
                  <InputLabel id="unitLabel">
                    {t("donor.editDonation.itemForm.unit.label")}
                  </InputLabel>
                  <Select
                    labelId="unitLabel"
                    id="unit"
                    name="unit"
                    required
                    value={itemFormik.values.unit}
                    label={t("donor.editDonation.itemForm.unit.label")}
                    onChange={itemFormik.handleChange}
                  >
                    {units.map((unit, index) => (
                      <MenuItem key={index} value={unit.value}>
                        {t(unit.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={processing}
                  loading={processing || isAdding}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {t("donor.editDonation.itemForm.submit")}
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>

          <List>
            {items.map((item, index) => (
              <ListItem
                sx={{
                  borderRadius: 16,
                  border: `1px solid ${theme.palette.text.secondary}`,
                  py: 0,
                  mb: 2,
                }}
                key={index}
              >
                {item.type === "grocery" && <ShoppingBagIcon />}
                {item.type === "preparedFood" && <LocalPizzaIcon />}
                {item.type === "fruitsVegetables" && <EggIcon />}
                {item.type === "beverages" && <CoffeeIcon />}
                {item.type === "petFood" && <PetsIcon />}

                <ListItemText
                  primary={item.name}
                  secondary={item.quantity + item.unit}
                  sx={{
                    ml: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />

                <IconButton
                  edge="end"
                  aria-label={t("donor.editDonation.removeItemAria")}
                  onClick={() => handleRemoveItem(item.name)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </>
  );
};

export default EditDonation;
