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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmployees, addEmployee } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";

import { IconButton, DialogActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEmployee } from "../api/employeeApi";

import EditIcon from "@mui/icons-material/Edit";
import { updateEmployee } from "../api/employeeApi";

export default function EmployeesPage() {

  // 🔹 search state
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔹 pagination
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({ page: 0, pageSize: 5 });

  // 🔹 sorting
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // 🔹 dialog open state
  const [openDialog, setOpenDialog] = useState(false);

  // 🔹 snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const queryClient = useQueryClient(); // 🔥 React Query cache access

  // 🔹 debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const sortField = sortModel[0]?.field;
  const sortOrder = sortModel[0]?.sort;

  // 🔥 Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: [
      "employees",
      paginationModel.page,
      paginationModel.pageSize,
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    queryFn: () =>
      fetchEmployees({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sortField,
        sortOrder,
        search: debouncedSearch,
      }),
    placeholderData: (prev) => prev,
  });

  const rows = data?.data ?? [];
  const totalRows = data?.total ?? 0;

  // 🔥 Mutation for adding employee
  const mutation = useMutation({
    mutationFn: addEmployee,

    // 🔹 success hone par
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // 🔥 employees query refetch hogi

      setOpenDialog(false);   // dialog close
      setOpenSnackbar(true);  // success message show
    },
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          {/* 🔥 Edit Button */}
          <IconButton
            color="primary"
            onClick={() => {
              setEditEmployee(params.row); // 🔹 selected row data store
              setOpenDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>

          {/* 🔥 Delete Button (already implemented) */}
          <IconButton
            color="error"
            onClick={() => setDeleteId(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }
    
  ];

  // 🔹 delete confirmation dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔥 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteId(null);       // dialog close
      setOpenSnackbar(true);   // success message
    },
  });

  // 🔹 edit employee state
  const [editEmployee, setEditEmployee] = useState<any>(null);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) =>
      updateEmployee(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setOpenDialog(false);
      setEditEmployee(null);
      setOpenSnackbar(true);
    },
  });

  return (
    <Box sx={{ height: 600, width: "100%" }}>

      {/* 🔹 Top Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>

        <TextField
          label="Search"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* 🔥 Add Employee Button */}
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Add Employee
        </Button>

      </Box>

      {/* 🔥 DataGrid */}
      <DataGrid
        rows={rows}
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

      {/* 🔥 Dialog for Form */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
      >
        <DialogTitle>
          {editEmployee ? "Edit Employee" : "Add Employee"}
        </DialogTitle>

        <DialogContent>

          <EmployeeForm
            defaultValues={editEmployee || undefined}
            onSubmit={(formData) => {

              if (editEmployee) {
                // 🔥 Update flow
                updateMutation.mutate({
                  id: editEmployee.id,
                  data: formData,
                });
              } else {
                // 🔥 Create flow
                mutation.mutate(formData);
              }
            }}
          />

        </DialogContent>
      </Dialog>

      {/* 🔥 Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>

          <Button onClick={() => setDeleteId(null)}>
            Cancel
          </Button>

          <Button
            color="error"
            onClick={() => {
              if (deleteId) {
                deleteMutation.mutate(deleteId); // 🔥 delete trigger
              }
            }}
          >
            Delete
          </Button>

        </DialogActions>
      </Dialog>

      {/* 🔥 Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">
          Employee added successfully!
        </Alert>
      </Snackbar>

    </Box>
  );
}