// UserList.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserList({ users, setUsers, loading }) {
  const navigate = useNavigate();

  const [deletingId, setDeletingId] = useState(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false); // Modal for refresh
  const [selectedUser, setSelectedUser] = useState(null); // Info popup
  const [refreshing, setRefreshing] = useState(false); // Table skeleton during refresh

  // Open refresh modal
  const handleRefreshClick = () => setShowRefreshModal(true);

  // Refresh user data
  const confirmRefresh = async () => {
    setShowRefreshModal(false);
    setRefreshing(true);

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();

      const normalized = data.map((u, i) => ({ ...u, id: i + 1 }));
      setUsers(normalized);

      toast.success("User data refreshed!");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setTimeout(() => setRefreshing(false), 900); // Smooth fade-out
    }
  };

  // Cancel modal
  const cancelRefresh = () => setShowRefreshModal(false);

  // Navigate to edit
  const handleEdit = (id) => navigate(`/edit/${id}`);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);

    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: "DELETE" });

      const filtered = users.filter((u) => u.id !== id);

      // Re-index user ids neatly
      const reIndexed = filtered.map((u, i) => ({ ...u, id: i + 1 }));
      setUsers(reIndexed);

      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Info modal
  const handleInfo = (u) => setSelectedUser(u);
  const closeInfo = () => setSelectedUser(null);

  // Show skeleton when loading OR refreshing
  const showTableSkeleton = loading || refreshing;

  // TABLE / CARD SKELETON
  if (showTableSkeleton) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2>PROJECT USERS</h2>
        </div>

        <div className="skeleton-table-v2">
          {Array(6).fill(0).map((_, i) => (
            <div className="skeleton-row-v2" key={i}>
              <div className="sk-avatar"></div>

              <div className="sk-lines">
                <div className="sk sk-line-long"></div>
                <div className="sk sk-line-short"></div>
              </div>

              <div className="sk sk-email-line"></div>
              <div className="sk sk-phone-line"></div>

              <div className="sk-action-group">
                <div className="sk sk-action-btn"></div>
                <div className="sk sk-action-btn"></div>
                <div className="sk sk-action-btn"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN FULL UI
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>PROJECT USERS</h2>

        <div className="panel-actions">
          <button className="btn small" onClick={handleRefreshClick}>Refresh</button>
          <button className="btn outline small" onClick={() => navigate("/add")}>+ Add</button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-responsive">
        <table className="dark-table">
          <thead>
            <tr>
              <th className="id-col">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th className="phone-col">Phone</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>

                <td className="actions-col">
                  <button className="btn tiny" onClick={() => handleEdit(u.id)}>Edit</button>

                  <button className="btn tiny danger" onClick={() => handleDelete(u.id)}>
                    {deletingId === u.id ? "Deleting..." : "Delete"}
                  </button>

                  <button className="btn tiny outline" onClick={() => handleInfo(u)}>i</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="card-grid">
        {users.map((u) => (
          <div className="user-card" key={u.id}>
            <div className="card-top">
              <div className="card-id">#{u.id}</div>
              <div className="card-name">{u.name}</div>
            </div>

            <div className="card-body">
              <div><strong>Email:</strong> {u.email}</div>
              <div><strong>Phone:</strong> {u.phone}</div>
            </div>

            <div className="card-footer">
              <button className="btn tiny" onClick={() => handleEdit(u.id)}>Edit</button>
              <button className="btn tiny danger" onClick={() => handleDelete(u.id)}>
                {deletingId === u.id ? "..." : "Delete"}
              </button>
              <button className="btn tiny outline" onClick={() => handleInfo(u)}>i</button>
            </div>
          </div>
        ))}
      </div>

      {/* INFO MODAL */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>User Details</h3>

            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>City:</strong> {selectedUser.address?.city || "N/A"}</p>
            <p><strong>Website:</strong> {selectedUser.website || "N/A"}</p>
            <p><strong>Company:</strong> {selectedUser.company?.name || "N/A"}</p>

            <div className="modal-buttons">
              <button className="confirm" onClick={closeInfo}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* REFRESH MODAL */}
      {showRefreshModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Refresh User Data?</h3>
            <p>Refreshing will reload all user data and discard any changes.</p>

            <div className="modal-buttons">
              <button className="confirm" onClick={confirmRefresh}>Refresh</button>
              <button className="cancel" onClick={cancelRefresh}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
