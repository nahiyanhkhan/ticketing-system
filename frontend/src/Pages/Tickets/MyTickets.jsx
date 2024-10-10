import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
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
        // Filter tickets to only show those created by the current user
        const myTickets = response.data.tickets.filter(
          (ticket) => ticket.createdBy._id === userData.userId
        );
        setTickets(myTickets);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(`Failed to fetch tickets: ${err.message}`);
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You haven't created any tickets yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Device Type</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
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

export default MyTickets;
