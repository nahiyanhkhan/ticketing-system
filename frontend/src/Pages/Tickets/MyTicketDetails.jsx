import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const MyTicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchMyTicketDetails();
    fetchCommentsWithRetry();
    // fetchComments();
  }, [id]);

  const fetchMyTicketDetails = async () => {
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

      // Check if the ticket belongs to the current user
      if (response.data.ticket.createdBy._id !== userDetails.userId) {
        throw new Error("You don't have permission to view this ticket");
      }

      setTicket(response.data.ticket);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      setError(
        err.message || "Failed to fetch ticket details. Please try again later."
      );
      setLoading(false);
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
    if (newComment.trim() === "") {
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

  const canUserComment = () => {
    return comments.length > 0 && ticket.status.toLowerCase() !== "closed";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="container-fluid mt-4">
      <h2>My Ticket Details</h2>
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
                  disabled={!canUserComment()}
                ></textarea>
                <button
                  className="btn btn-primary mt-2"
                  onClick={addComment}
                  disabled={!canUserComment() || newComment.trim() === ""}
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
              <p className="card-text">
                <strong>Status:</strong> {ticket.status}
              </p>
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
          <Link to="/my-tickets" className="btn btn-secondary mt-3">
            Back to My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyTicketDetails;
