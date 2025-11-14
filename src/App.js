// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserList from "./components/UserList";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Global full-screen skeleton

  // Warn user before reloading the tab (prevents loss of temp data)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "All data will be lost if you reload this page!";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Fetch initial user list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();

        // Normalize API user id to 1–10
        const normalized = data.map((u, i) => ({ ...u, id: i + 1 }));
        setUsers(normalized);
      } catch {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false); // Stop full-page skeleton
      }
    };
    fetchUsers();
  }, []);

  // GLOBAL full-page skeleton until data loads
  if (loading) {
    return (
      <div className="global-skeleton">
        <div className="sk-topbar"></div>

        <div className="sk-layout">
          <div className="sk-main">
            {Array(6).fill(0).map((_, i) => (
              <div className="sk-main-row" key={i}>
                <div className="sk sk-wide"></div>
              </div>
            ))}
          </div>

          <div className="sk-side">
            <div className="sk sk-side-box"></div>
            <div className="sk sk-side-box small"></div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP after loading
  return (
    <Router>
      <div className="app-dark">
        <ToastContainer position="top-right" />

        {/* HEADER / TOPBAR */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo">CRUD</div>
            <div className="brand-text">
              <h1>User Management</h1>
              <span className="brand-sub">Control every user with clarity.</span>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="topnav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/add" className="nav-cta">+ Add User</Link>
          </nav>
        </header>

        {/* PAGE GRID (Main content + Sidebar) */}
        <main className="main-grid">
          <section className="content-card">
            <Routes>
              <Route
                path="/"
                element={
                  <UserList
                    users={users}
                    setUsers={setUsers}
                    loading={loading}
                  />
                }
              />
              <Route path="/add" element={<CreateUser users={users} setUsers={setUsers} />} />
              <Route path="/edit/:id" element={<EditUser users={users} setUsers={setUsers} />} />
            </Routes>
          </section>

          {/* Sidebar Section */}
          <aside className="side-card">
            <div className="side-section">
              <h3>Quick actions</h3>
              <button className="btn small" onClick={() => toast.info("Try adding a user!")}>
                Add sample
              </button>
            </div>

            <div className="side-section muted">
              <h4>Note</h4>
              <p>Data resets when you reload the page.</p>
            </div>
          </aside>
        </main>

        {/* FOOTER */}
        <footer className="footer">Made with ♥ — User Management Application</footer>
      </div>
    </Router>
  );
}

export default App;
