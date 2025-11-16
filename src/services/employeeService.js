import axios from "axios";

const API_URL = "http://localhost:3000/api/employees";

export const getAllEmployees = async (
  page = 1,
  limit = 10,
  search = "",
  sortField = "",
  sortOrder = "asc",
  filters = {}
) => {
  const params = {
    page,
    limit,
    search,
    sortField,
    sortOrder,
    filterName: filters.name || "",
    filterAge: filters.age || "",
    filterSkills: filters.skills || "",
    filterAddress: filters.address || "",
    filterDesignation: filters.designation || "",
  };

  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const formData = new FormData();

  Object.keys(employeeData).forEach((key) => {
    if (employeeData[key] !== null && employeeData[key] !== undefined) {
      formData.append(key, employeeData[key]);
    }
  });

  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const formData = new FormData();

  Object.keys(employeeData).forEach((key) => {
    if (employeeData[key] !== null && employeeData[key] !== undefined) {
      formData.append(key, employeeData[key]);
    }
  });

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
