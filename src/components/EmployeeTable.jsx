import { useState, useEffect } from "react";
import { getAllEmployees, deleteEmployee } from "../services/employeeService";
import AddEmployee from "./AddEmployee";
import UpdateEmployee from "./UpdateEmployee";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    skills: "",
    address: "",
    designation: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees(
        currentPage,
        10,
        search,
        sortField,
        sortOrder,
        filters
      );
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, search, sortField, sortOrder, filters]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        alert("Employee deleted successfully");
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);
    setShowUpdateModal(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      age: "",
      skills: "",
      address: "",
      designation: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Employee Management System</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="btn-add-emp" onClick={() => setShowAddModal(true)}>
            Add Emp
          </button>
        </div>
      </div>

      <div className="filter-section">
        <button
          className="btn-toggle-filter"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "▲ Hide Filters" : "▼ Show Filters"}
        </button>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Age:</label>
              <input
                type="number"
                placeholder="Filter by age"
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Skills:</label>
              <input
                type="text"
                placeholder="Filter by skills"
                value={filters.skills}
                onChange={(e) => handleFilterChange("skills", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Address:</label>
              <input
                type="text"
                placeholder="Filter by address"
                value={filters.address}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Designation:</label>
              <input
                type="text"
                placeholder="Filter by designation"
                value={filters.designation}
                onChange={(e) =>
                  handleFilterChange("designation", e.target.value)
                }
                className="filter-input"
              />
            </div>
            <button className="btn-clear-filter" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th onClick={() => handleSort("name")} className="sortable">
                  Name
                  {sortField === "name" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("age")} className="sortable">
                  Age
                  {sortField === "age" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("skills")} className="sortable">
                  Skills
                  {sortField === "skills" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("address")} className="sortable">
                  Address
                  {sortField === "address" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  onClick={() => handleSort("designation")}
                  className="sortable"
                >
                  Designation
                  {sortField === "designation" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>
                      <div className="name-with-image">
                        {emp.profileImage ? (
                          <img
                            src={`http://localhost:3000${emp.profileImage}`}
                            alt={emp.name}
                            className="profile-icon"
                          />
                        ) : (
                          <div className="profile-icon-placeholder">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td>{emp.age}</td>
                    <td>{emp.skills}</td>
                    <td>{emp.address}</td>
                    <td>{emp.designation}</td>
                    <td>
                      <button
                        className="btn-update"
                        onClick={() => handleUpdate(emp)}
                      >
                        Update
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <span>
              Showing {employees.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
              {(currentPage - 1) * 10 + employees.length} of {employees.length}{" "}
              entries
            </span>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="page-number">{currentPage}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(1, Math.min(prev + 1, totalPages))
                  )
                }
                disabled={currentPage >= totalPages || totalPages <= 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddEmployee
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchEmployees();
          }}
        />
      )}

      {showUpdateModal && (
        <UpdateEmployee
          employee={selectedEmployee}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedEmployee(null);
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
