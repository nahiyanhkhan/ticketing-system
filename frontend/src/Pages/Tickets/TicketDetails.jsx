import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const userDetailsString = localStorage.getItem("userDetails");
        if (!userDetailsString) {
          throw new Error("No user details found");
        }

        const userDetails = JSON.parse(userDetailsString);
        const token = userDetails.token;

        if (!token) {
          throw new Error("No authentication token found in user details");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tickets/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTicket(response.data.ticket);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to fetch ticket details. Please try again later.");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="container mt-4">
      <h2>Ticket Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{ticket.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Status: {ticket.status}
          </h6>
          <p className="card-text">
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p className="card-text">
            <strong>Device Type:</strong> {ticket.deviceType}
          </p>
          <p className="card-text">
            <strong>Description:</strong> {ticket.description}
          </p>
          <p className="card-text">
            <strong>Created By:</strong> {ticket.createdBy.email}
          </p>
          <p className="card-text">
            <strong>Created At:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
          {ticket.assignedTo && (
            <p className="card-text">
              <strong>Assigned To:</strong> {ticket.assignedTo.email}
            </p>
          )}
        </div>
      </div>
      <Link to="/tickets" className="btn btn-secondary mt-3">
        Back to Ticket List
      </Link>
    </div>
  );
};

export default TicketDetails;
