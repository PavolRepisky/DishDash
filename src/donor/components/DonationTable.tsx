import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Photo as PhotoIcon,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { Donation } from "../types/Donation";

function descendingComparator(a: any, b: any, orderBy: string) {
  const order =
    orderBy === "donation"
      ? "title"
      : orderBy === "date"
      ? "createdAt"
      : orderBy === "status"
      ? "active"
      : "title";

  const c1 = orderBy === "date" ? Date.parse(a?.[order]) : a?.[order] ?? "0";
  const c2 = orderBy === "date" ? Date.parse(b?.[order]) : b?.[order] ?? "0";

  if (c2 < c1) {
    return -1;
  }
  if (c2 > c1) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: string
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: Donation[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0] as Donation);
}

interface Data {
  id: number;
  donation: string;
  date: string;
  status: string;
}

interface HeadCell {
  id: keyof Data;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "donation",
    align: "left",
    label: "donor.donationManagement.table.headers.donation",
  },
  {
    id: "date",
    align: "center",
    label: "donor.donationManagement.table.headers.createdAt",
  },
  {
    id: "status",
    align: "center",
    label: "donor.donationManagement.table.headers.status",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow sx={{ "& th": { border: 0 } }}>
        <TableCell sx={{ py: 0 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all donations",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sx={{ py: 0 }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
              {t(headCell.label)}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t("donor.donationManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type DonationRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (donationIds: string[]) => void;
  onEdit: (donationId: string) => void;
  processing: boolean;
  selected: boolean;
  donation: Donation;
};

const DonationRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  donation,
}: DonationRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { i18n, t } = useTranslation();

  const labelId = `enhanced-table-checkbox-${index}`;
  const openActions = Boolean(anchorEl);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseActions();
    onDelete([donation.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(donation.id);
  };

  const formatDate = (dateData: string) => {
    const date = new Date(dateData);
    return `${date.toLocaleDateString(i18n.language)} ${date.toLocaleTimeString(
      i18n.language
    )}`;
  };

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={donation.id}
      selected={selected}
      sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
    >
      <TableCell
        padding="checkbox"
        sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
      >
        <Checkbox
          color="primary"
          checked={selected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
          onClick={() => onCheck(donation.id)}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PhotoIcon sx={{ mr: 3, fontSize: "2.5rem" }} />
          <Box>
            <Typography component="div" variant="h6">
              {donation.title}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {donation.location}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        {formatDate(donation.createdAt ?? new Date().toISOString())}
      </TableCell>
      <TableCell align="center">
        {donation.active ? (
          <Chip color="primary" label={t("donor.donationManagement.active")} />
        ) : (
          <Chip label={t("donor.donationManagement.fulfilled")} />
        )}
      </TableCell>
      <TableCell
        align="right"
        sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
      >
        <IconButton
          id="donation-row-menu-button"
          aria-label="donation actions"
          aria-controls="donation-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="donation-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="donation-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{" "}
            {t("common.edit")}
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>{" "}
            {t("common.delete")}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

type DonationTableProps = {
  processing: boolean;
  onDelete: (donationIds: string[]) => void;
  onEdit: (donationId: string) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  donations?: Donation[];
};

const DonationTable = ({
  onDelete,
  onEdit,
  onSelectedChange,
  processing,
  selected,
  donations = [],
}: DonationTableProps) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t } = useTranslation();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(donations);
      onSelectedChange(newSelecteds);
      return;
    }
    onSelectedChange([]);
  };

  const handleClick = (id: string) => {
    let newSelected: string[] = selectUtils.selectOne(selected, id);
    onSelectedChange(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const visibleRows = useMemo(
    () =>
      stableSort(donations, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [donations, order, orderBy, page, rowsPerPage]
  );

  if (donations.length === 0) {
    return <Empty title={t("donor.donationManagement.noDonations")} />;
  }

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: "separate",
            borderSpacing: "0 1rem",
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={donations.length}
          />
          <TableBody>
            {visibleRows.map((donation, index) => (
              <DonationRow
                index={index}
                key={donation.id}
                onCheck={handleClick}
                onDelete={onDelete}
                onEdit={onEdit}
                processing={processing}
                selected={isSelected(donation.id ?? "")}
                donation={donation}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={donations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default DonationTable;
