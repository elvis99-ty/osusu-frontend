import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import BalanceCard from "../components/BalanceCard";
import {
  FaUser,
  FaUsers,
  FaPlusCircle,
  FaFolderOpen,
  FaExclamationTriangle,
  FaUserTimes,
  FaUsersCog,
  FaCommentDots,
  FaExchangeAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// 👉 Import sections
import ProfileSection from "./DashboardSections/ProfileSection";
import JoinGroupSection from "./DashboardSections/JoinGroupSection";
import ViewGroupsSection from "./DashboardSections/ViewGroupsSection";
import ReportUserSection from "./DashboardSections/ReportUserSection";
import ReportGroupSection from "./DashboardSections/ReportGroupSection";
import TransactionHistory from "./DashboardSections/TransactionHistory";
import Notifications from "./DashboardSections/Notifications";

const LoadingWrapper = ({ title, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [title]);

  return (
    <div className="fade-container">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading {title}…</p>
        </div>
      ) : (
        <div className="fade-in">{children}</div>
      )}
    </div>
  );
};

// ✅ Dummy chart data
const barData = [
  { name: "Jan", contributions: 4000 },
  { name: "Feb", contributions: 3000 },
  { name: "Mar", contributions: 5000 },
  { name: "Apr", contributions: 2780 },
  { name: "May", contributions: 4890 },
];

const pieData = [
  { name: "Savings", value: 4000 },
  { name: "Loans", value: 3000 },
  { name: "Expenses", value: 2000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openGroups, setOpenGroups] = useState(false);
  const [openDisputes, setOpenDisputes] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [balance] = useState(50000000); // Example balance

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return <ProfileSection />;
      case "join-group":
        return <JoinGroupSection />;
      case "view-groups":
        return <ViewGroupsSection />;
      case "report-user":
        return <ReportUserSection />;
      case "report-group":
        return <ReportGroupSection />;
      case "general-complaint":
        return <h1 className="dashboard-title">General Complaint</h1>;
      case "transactions":
        return <TransactionHistory />;
      case "notifications":
        return <Notifications onUnreadChange={setUnreadCount} />;
      default:
        return (
          <div>
            {/* ✅ Greeting */}
            <h1 className="dashboard-title">
              Welcome, {user?.name || "User"} 👋
            </h1>
            
            {/* ✅ Balance card under greeting */}
            <div className="dashboard-balance-wrapper mb-10">
              <BalanceCard balance={formatCurrency(balance)} />
            </div>

            {/* ✅ Dashboard graphs */}
            <div className="dashboard-charts grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="chart-card">
                <h2 className="chart-title">Contribution Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="contributions" fill="#8884d8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="chart-card">
                <h2 className="chart-title">Spending Breakdown</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <button
            className="floating-btn"
            onClick={() =>console.log("Create Group Clicked")}
            >
              <FaPlusCircle size={28}/> 
            </button>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2
          className={`sidebar-title big-title ${
            activeMenu === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActiveMenu("dashboard")}
        >
          DASHBOARD
        </h2>

        <ul className="sidebar-menu">
          <li
            className={activeMenu === "profile" ? "active" : ""}
            onClick={() => setActiveMenu("profile")}
          >
            <FaUser className="icon" /> Profile
          </li>

          <li onClick={() => setOpenGroups(!openGroups)}>
            <FaUsers className="icon" /> Groups
          </li>
          {openGroups && (
            <ul className="submenu">
              <li
                className={activeMenu === "join-group" ? "active" : ""}
                onClick={() => setActiveMenu("join-group")}
              >
                <FaPlusCircle className="icon" /> Join Group
              </li>
              <li
                className={activeMenu === "view-groups" ? "active" : ""}
                onClick={() => setActiveMenu("view-groups")}
              >
                <FaFolderOpen className="icon" /> View Groups
              </li>
            </ul>
          )}

          <li onClick={() => setOpenDisputes(!openDisputes)}>
            <FaExclamationTriangle className="icon" /> Dispute Center
          </li>
          {openDisputes && (
            <ul className="submenu">
              <li
                className={activeMenu === "report-user" ? "active" : ""}
                onClick={() => setActiveMenu("report-user")}
              >
                <FaUserTimes className="icon" /> Report User
              </li>
              <li
                className={activeMenu === "report-group" ? "active" : ""}
                onClick={() => setActiveMenu("report-group")}
              >
                <FaUsersCog className="icon" /> Report Group
              </li>
              <li
                className={activeMenu === "general-complaint" ? "active" : ""}
                onClick={() => setActiveMenu("general-complaint")}
              >
                <FaCommentDots className="icon" /> General Complaint
              </li>
            </ul>
          )}

          <li
            className={activeMenu === "transactions" ? "active" : ""}
            onClick={() => setActiveMenu("transactions")}
          >
            <FaExchangeAlt className="icon" /> Transactions
          </li>

          <li
            className={activeMenu === "notifications" ? "active" : ""}
            onClick={() => setActiveMenu("notifications")}
          >
            <FaBell className="icon" /> Notifications
            {unreadCount > 0 && ` (${unreadCount})`}
          </li>
        </ul>

        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <LoadingWrapper title={activeMenu}>{renderContent()}</LoadingWrapper>
      </main>
    </div>
  );
};

export default Dashboard;