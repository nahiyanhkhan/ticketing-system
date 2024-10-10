import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../../component/Toaster/Toaster";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deviceType, setDeviceType] = useState("mouse");
  const [priority, setPriority] = useState("low");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showSuccessToaster, setShowSuccessToaster] = useState(false);
  const [showErrorToaster, setShowErrorToaster] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.role) {
          setUserRole(userData.role);
        }
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (userRole !== "user") {
    //   setError("Only users can create tickets.");
    //   setShowErrorToaster(true);
    //   return;
    // }

    try {
      const userDataString = localStorage.getItem("userDetails");
      if (!userDataString) throw new Error("No authentication details found.");

      const userData = JSON.parse(userDataString);
      if (!userData.token) throw new Error("Authentication token missing.");

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}tickets`,
        { title, description, deviceType, priority },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      setShowSuccessToaster(true);
      clearForm();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the ticket."
      );
      setShowErrorToaster(true);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDeviceType("mouse");
    setPriority("low");
  };

  // if (userRole !== "user") {
  //   return (
  //     <div className="container mt-4">
  //       <div className="alert alert-danger">
  //         You do not have permission to create tickets. Only users can create
  //         tickets.
  //       </div>
  //       <Toaster
  //         title={error}
  //         bg="danger"
  //         showToaster={showErrorToaster}
  //         setShowToaster={setShowErrorToaster}
  //         to="create-ticket"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="container mt-4">
      <h2>Create New Ticket</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="deviceType" className="form-label">
            Device Type
          </label>
          <select
            className="form-control"
            id="deviceType"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
          >
            <option value="mouse">Mouse</option>
            <option value="keyboard">Keyboard</option>
            <option value="monitor">Monitor</option>
            <option value="laptop">Laptop</option>
            <option value="usb hub">USB hub</option>
            <option value="webcam">Webcam</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            className="form-control"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Ticket
        </button>
      </form>
      <Toaster
        title="Ticket created successfully"
        bg="success"
        showToaster={showSuccessToaster}
        setShowToaster={setShowSuccessToaster}
        to="tickets"
      />
      <Toaster
        title={error}
        bg="danger"
        showToaster={showErrorToaster}
        setShowToaster={setShowErrorToaster}
        to="create-ticket"
      />
    </div>
  );
};

export default CreateTicket;
