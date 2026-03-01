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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function EmployeesPage() {

  // 🔹 loading state (page change, sort change pe trigger hoga)
  const [loading, setLoading] = useState(true);

  // 🔹 static employee data (later JSON server se replace hoga)
  const [rows] = useState([
    { id: 1, fullName: "John Doe", email: "john@example.com", department: "IT", status: "Active" },
    { id: 2, fullName: "Jane Smith", email: "jane@example.com", department: "HR", status: "Inactive" },
    { id: 3, fullName: "Robert King", email: "robert@example.com", department: "IT", status: "Active" },
    { id: 4, fullName: "Emily Clark", email: "emily@example.com", department: "Finance", status: "Active" },
    { id: 5, fullName: "David Lee", email: "david@example.com", department: "HR", status: "Inactive" },
    { id: 6, fullName: "Chris Brown", email: "chris@example.com", department: "IT", status: "Active" },
  ]);

  // 🔹 search + filters state
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // 🔹 controlled pagination model
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>({
      page: 0,
      pageSize: 5,
    });

  // 🔹 controlled sorting model
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // 🔥 simulate API delay (page ya sort change hone pe loading dikhega)
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);

  }, [paginationModel, sortModel]); 
  // 🔹 page change ya sorting change → loading trigger

  // 🔹 debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // 🔹 highlight function
  const highlightText = (text: string) => {
    if (!debouncedSearch) return text;

    const regex = new RegExp(`(${debouncedSearch})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === debouncedSearch.toLowerCase()
        ? <mark key={index}>{part}</mark>
        : part
    );
  };

  // 🔥 combined filtering logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {

      const matchesSearch =
        !debouncedSearch ||
        row.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.department.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        !statusFilter || row.status === statusFilter;

      const matchesDepartment =
        !departmentFilter || row.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [rows, debouncedSearch, statusFilter, departmentFilter]);

  // 🔥 apply sorting manually (server-side simulation)
  const sortedRows = useMemo(() => {

    // 🔹 agar sorting apply nahi hai → original filtered rows return
    if (sortModel.length === 0) return filteredRows;

    const { field, sort } = sortModel[0];

    return [...filteredRows].sort((a: any, b: any) => {

      if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
      return 0;

    });

  }, [filteredRows, sortModel]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },

    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      renderCell: (params) => <span>{highlightText(params.value)}</span>,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => <span>{highlightText(params.value)}</span>,
    },

    { field: "department", headerName: "Department", width: 150 },

    { field: "status", headerName: "Status", width: 130 },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>

      {/* 🔹 Filter Section */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}>

        <TextField
          label="Search"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={departmentFilter}
            label="Department"
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 🔥 DataGrid with Controlled Sorting */}
      <DataGrid
        rows={sortedRows}
        columns={columns}
        loading={loading}
        checkboxSelection
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}                // 🔹 controlled sort model
        onSortModelChange={setSortModel}     // 🔹 sort change pe state update
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}