// CreateUser.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateUser({ users, setUsers }) {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle create user submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    // Local new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      phone,
    };

    setSubmitting(true);

    try {
      // Fake POST → JSONPlaceholder returns the same body
      await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });

      // Add locally
      setUsers([...users, newUser]);

      toast.success("User added");
      navigate("/");
    } catch {
      toast.error("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Add New User</h2>
      </div>

      {/* FORM */}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="field">
          <span className="field-label">Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="field">
          <span className="field-label">Phone</span>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>

        {/* BUTTONS */}
        <div className="form-actions">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add User"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
              toast.info("Form cleared");
            }}
          >
            Clear
          </button>

          <button
            type="button"
            className="btn danger"
            onClick={() => {
              navigate("/");
              toast.info("Cancelled");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;
