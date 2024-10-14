import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTicketDetails();
    fetchCommentsWithRetry();
    // fetchComments();
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails?.token;

      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}tickets/${ticket._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowDeleteModal(false);
      navigate("/tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

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
      setStatus(response.data.ticket.status);
      setPriority(response.data.ticket.priority);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      setError("Failed to fetch ticket details. Please try again later.");
      setLoading(false);
    }
  };

  const updateTicket = async (field, value) => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails.token;

      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}tickets/${id}`,
        { [field]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh ticket details after update
      fetchTicketDetails();
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Failed to update ticket. Please try again later.");
    }
  };

  const fetchCommentsWithRetry = async (retries = 3) => {
    try {
      await fetchComments();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => fetchCommentsWithRetry(retries - 1), 1000);
      } else {
        console.error("Failed to fetch comments after multiple attempts");
      }
    }
  };

  const fetchComments = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails.token;

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}tickets/${id}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const addComment = async () => {
    if (newComment.trim() === "" || ticket.status.toLowerCase() === "closed") {
      return;
    }

    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const token = userDetails.token;

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}tickets/${id}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="container-fluid mt-4">
      <h2>Ticket Details</h2>
      <div className="row">
        {/* Comments Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Comments</h5>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  disabled={ticket.status.toLowerCase() === "closed"}
                ></textarea>
                <button
                  className="btn btn-primary mt-2"
                  onClick={addComment}
                  disabled={
                    newComment.trim() === "" ||
                    ticket.status.toLowerCase() === "closed"
                  }
                >
                  Add Comment
                </button>
              </div>
              <div
                className="comment-list"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {comments
                  .slice()
                  .reverse()
                  .map((comment, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <small className="text-muted">
                          {comment.repliedBy
                            ? `${comment.repliedBy.fname} ${comment.repliedBy.lname}`
                            : "Unknown User"}
                        </small>
                        <p className="mb-0">{comment.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Details Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{ticket.title}</h4>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Status:</strong>
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    updateTicket("status", e.target.value);
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <strong>Priority:</strong>
                </label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    updateTicket("priority", e.target.value);
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <p className="card-text">
                <strong>Device Type:</strong> {ticket.deviceType}
              </p>
              <p className="card-text">
                <strong>Description:</strong> {ticket.description}
              </p>
              <p className="card-text">
                <strong>Created By:</strong> {ticket.createdBy.fname}{" "}
                {ticket.createdBy.lname} ({ticket.createdBy.email})
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
          <div className="mt-3">
            <Link to="/tickets" className="btn btn-secondary me-2">
              Back to Ticket List
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete Ticket
            </Button>
          </div>

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this ticket?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;