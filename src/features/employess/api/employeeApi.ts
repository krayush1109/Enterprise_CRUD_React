// 🔹 Axios instance create kar rahe hain
// Base URL JSON server ka

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// 🔹 API response type define kar rahe hain
export interface EmployeesResponse {
  data: any[];
  total: number;
}

// 🔥 Fetch employees with server-like params
export const fetchEmployees = async ({
  page,
  pageSize,
  sortField,
  sortOrder,
  search,
  department, // ✅ NEW
  status,     // ✅ NEW
}: any) => {

  const params: any = {
    _page: page + 1,  // 🔹 JSON server 1-based page use karta hai
    _limit: pageSize,
  };

  // 🔹 Sorting params add karna
  if (sortField && sortOrder) {
    params._sort = sortField;
    params._order = sortOrder;
  }

  // 🔹 Simple search (fullName ke against)
  if (search) {
    params.q = search;
    // 🔹 JSON server me q generic search karta hai
  }

  // ✅ Filters (json-server supports exact match filtering)
  if (department) {
    params.department = department;
  }

  if (status) params.status = status;


  const response = await api.get("/employees", { params });

  return {
    data: response.data,
    total: Number(response.headers["x-total-count"]),
    // 🔹 JSON server total count header me bhejta hai
  };
};

// 🔹 Add Employee API (POST request)
export const addEmployee = async (newEmployee: any) => {

  // 🔥 POST request JSON server ko bhej rahe hain
  const response = await api.post("/employees", newEmployee);

  return response.data;
  // 🔹 created employee return karega
};

// 🔹 Update Employee API (PUT request)
export const updateEmployee = async (
  id: string,
  updatedData: any
) => {

  // 🔥 PUT request specific employee id par
  const response = await api.put(`/employees/${id}`, updatedData);

  return response.data;
  // 🔹 updated employee return karega
};

// 🔹 Delete Employee API
export const deleteEmployee = async (id: string) => {

  // 🔥 DELETE request JSON server ko bhej rahe hain
  await api.delete(`/employees/${id}`);

  return id; // 🔹 deleted id return kar rahe hain
};