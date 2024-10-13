import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const userDataString = localStorage.getItem("userDetails");
      if (!userDataString) {
        throw new Error("No user data found");
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;

      if (!token) {
        throw new Error("No authentication token found in user data");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(
        response.data.tickets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(`Failed to fetch tickets: ${err.message}`);
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${ticket.createdBy.fname} ${ticket.createdBy.lname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === "all" ||
      ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Ticket List</h2>
      <div className="row mb-3 align-items-end">
        <div className="col-md-5">
          <label htmlFor="searchInput" className="form-label">
            Search:
          </label>
          <input
            id="searchInput"
            type="text"
            className="form-control"
            placeholder="Search by title or ticket issuer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="statusFilter" className="form-label">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="priorityFilter" className="form-label">
            Filter by Priority:
          </label>
          <select
            id="priorityFilter"
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      {filteredTickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Ticket Issuer</th>
              <th>Device Type</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{`${ticket.createdBy.fname} ${ticket.createdBy.lname}`}</td>
                <td>{ticket.deviceType}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/tickets/${ticket._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketList;