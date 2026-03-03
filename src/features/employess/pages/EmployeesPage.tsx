import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  IconButton,
  DialogActions,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import EmployeeForm from "../components/EmployeeForm";

import {
  fetchEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} from "../api/employeeApi";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function EmployeesPage() {
  // -----------------------------
  // ✅ Search + Debounce State
  // -----------------------------
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // -----------------------------
  // ✅ Filters State ("" means All)
  // -----------------------------
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // -----------------------------
  // ✅ Pagination State (server mode)
  // -----------------------------
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({ page: 0, pageSize: 5 });

  // -----------------------------
  // ✅ Sorting State (server mode)
  // -----------------------------
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // -----------------------------
  // ✅ Dialog State
  // -----------------------------
  const [openDialog, setOpenDialog] = useState(false);

  // -----------------------------
  // ✅ Snackbar State (dynamic message + severity)
  // Color mapping:
  // - Add success    => success (green)
  // - Update success => info (blue)
  // - Delete success => warning (orange)
  // - Any error      => error (red)
  // -----------------------------
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("Success!");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMsg(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const queryClient = useQueryClient();

  // -----------------------------
  // ✅ Debounce logic for Search
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // -----------------------------
  // ✅ Best UX: when Search/Filters change,
  // go back to first page (page=0)
  // -----------------------------
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, departmentFilter, statusFilter]);

  // -----------------------------
  // ✅ Sorting field + order extracted (server sorting)
  // -----------------------------
  const sortField = sortModel[0]?.field;
  const sortOrder = sortModel[0]?.sort;

  // -----------------------------
  // ✅ Fetch employees with React Query
  // -----------------------------
  const { data, isLoading } = useQuery({
    queryKey: [
      "employees",
      paginationModel.page,
      paginationModel.pageSize,
      sortField,
      sortOrder,
      debouncedSearch,
      departmentFilter,
      statusFilter,
    ],
    queryFn: () =>
      fetchEmployees({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sortField,
        sortOrder,
        search: debouncedSearch,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const rows = data?.data ?? [];
  const totalRows = data?.total ?? 0;

  // -----------------------------
  // ✅ Add serial number (S.No.) for UI only
  // -----------------------------
  const rowsWithSrNo = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return rows.map((row: any, index: number) => ({
      ...row,
      srNo: start + index + 1,
    }));
  }, [rows, paginationModel.page, paginationModel.pageSize]);

  // -----------------------------
  // ✅ Mutations (Add / Update / Delete)
  // -----------------------------
  const addMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpenDialog(false);

      // ✅ Add success => Green
      showSnackbar("Employee added successfully!", "success");
    },
    onError: () => {
      showSnackbar("Failed to add employee!", "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpenDialog(false);
      setEditEmployee(null);

      // ✅ Update success => Blue
      showSnackbar("Employee updated successfully!", "info");
    },
    onError: () => {
      showSnackbar("Failed to update employee!", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteId(null);

      // ✅ Delete success => Orange
      showSnackbar("Employee deleted successfully!", "warning");
    },
    onError: () => {
      showSnackbar("Failed to delete employee!", "error");
    },
  });

  // -----------------------------
  // ✅ Highlight search matches in cells
  // -----------------------------
  const highlightText = (text: string) => {
    if (!debouncedSearch) return text;

    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  // -----------------------------
  // ✅ Delete confirmation state
  // -----------------------------
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // -----------------------------
  // ✅ Edit employee state
  // -----------------------------
  const [editEmployee, setEditEmployee] = useState<any>(null);

  // -----------------------------
  // ✅ DataGrid Columns
  // - UUID ID column removed
  // - S.No. column added
  // -----------------------------
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "srNo",
        headerName: "S.No.",
        width: 90,
        sortable: false, // UI-only
        filterable: false,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fullName",
        headerName: "Full Name",
        flex: 1,
        renderCell: (params) => (
          <span>{highlightText(String(params.value ?? ""))}</span>
        ),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        renderCell: (params) => (
          <span>{highlightText(String(params.value ?? ""))}</span>
        ),
      },
      { field: "department", headerName: "Department", width: 150 },
      { field: "status", headerName: "Status", width: 130 },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                setEditEmployee(params.row);
                setOpenDialog(true);
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => setDeleteId(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ],
    [debouncedSearch]
  );

  // -----------------------------
  // ✅ Clear filters/search
  // -----------------------------
  const handleClear = () => {
    setSearchText("");
    setDebouncedSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      {/* ✅ Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            setEditEmployee(null);
            setOpenDialog(true);
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* ✅ DataGrid */}
      <DataGrid
        rows={rowsWithSrNo}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        sortingMode="server"
        rowCount={totalRows}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* ✅ Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditEmployee(null);
        }}
        fullWidth
      >
        <DialogTitle>{editEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <EmployeeForm
            defaultValues={editEmployee || undefined}
            onSubmit={(formData) => {
              if (editEmployee) {
                updateMutation.mutate({
                  id: editEmployee.id,
                  data: formData,
                });
              } else {
                addMutation.mutate(formData);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              if (deleteId) deleteMutation.mutate(deleteId);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar (now severity changes colors) */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}