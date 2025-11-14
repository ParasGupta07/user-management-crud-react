// EditUser.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditUser({ users, setUsers }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = parseInt(id, 10);

  // Find selected user
  const userToEdit = users.find((u) => u.id === numericId);

  // Controlled form fields
  const [name, setName] = useState(userToEdit?.name || "");
  const [email, setEmail] = useState(userToEdit?.email || "");
  const [phone, setPhone] = useState(userToEdit?.phone || "");

  const [submitting, setSubmitting] = useState(false);

  // Sync fields if user changes
  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone);
    }
  }, [userToEdit]);

  // If invalid id
  if (!userToEdit) {
    return <div className="muted">User not found</div>;
  }

  // Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const updated = { name, email, phone };

    setSubmitting(true);

    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${numericId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      // Apply update locally
      const updatedUsers = users.map((u) =>
        u.id === numericId ? { ...u, ...updated } : u
      );

      setUsers(updatedUsers);
      toast.success("User updated");
      navigate("/");
    } catch {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Edit User</h2>
        <p className="muted">Modify details and save</p>
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
            {submitting ? "Updating..." : "Update User"}
          </button>

          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              navigate("/");
              toast.info("Edit cancelled");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
