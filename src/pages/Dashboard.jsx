import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 


// const maskAccountNumber = (accountNumber) => {
//   if (!accountNumber) {
//     return 'N/A';
//   }
//   const accStr = String(accountNumber); 

//   if (accStr.length <= 6) { 
//     return accStr;
//   }
//   const firstThree = accStr.slice(0, 3);
//   const lastThree = accStr.slice(-3);
//   const maskedMiddle = 'X'.repeat(accStr.length - 6); 
//   return `${firstThree}${maskedMiddle}${lastThree}`;
// };


const Dashboard = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAccordion, setOpenAccordion] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user || !token) {
        setLoading(false);
        if (!token) navigate('/login');
        return;
      }
      
      setLoading(false); 
    };

    if (isAuthenticated && user && token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      if (!token) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, token, navigate, logout]);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleViewOpenGroupsClick = () => {
    navigate('/groups');
  };

  const handleCreateGroupClick = () => {
    navigate('/create-group');
  };

  const handleMyGroupsClick = () => {
    navigate('/my-groups');
  };

  if (loading) {
    return <div className="loading-message">Loading your dashboard data...</div>;
  }

  if (error && isAuthenticated) { 
    return <div className="error-message">{error}</div>;
  }

  if (!isAuthenticated) {
    return <div className="info-message">Please log in to view your dashboard.</div>;
  }


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p>Manage your Susu contribution circles efficiently.</p>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card profile-card user-summary-card">
          <div className="card-header-main">
            <span className="card-logo">SusuFlow</span>
            <h2 className="user-card-name">{user?.name || 'User Name'}</h2>
          </div>
          
          <div className="card-details-main"> 
            <p className="user-card-email"><i className="fas fa-envelope icon"></i> {user?.email || 'N/A'}</p>
            <p className="user-card-phone"><i className="fas fa-phone-alt icon"></i> {user?.phone || 'N/A'}</p>
            <p className="user-card-bank-name"><i className="fas fa-university icon"></i> {user?.bankName || 'N/A'}</p>
            
          </div>

          <div className="card-footer-actions">
            <button onClick={logout} className="logout-button-on-card">
              <i className="fas fa-sign-out-alt icon"></i> Logout
            </button>
          </div>
        </div>

        <div className="dashboard-card quick-actions-card">
          <h3><i className="fas fa-bolt icon-style"></i> Quick Actions</h3>
          <button className="action-button" onClick={handleCreateGroupClick}>
            <i className="fas fa-plus icon-left"></i> Create New Group
          </button>
          <button className="action-button" onClick={handleViewOpenGroupsClick}>
            <i className="fas fa-users icon-left"></i> View/Join Open Groups
          </button>
          <button className="action-button" onClick={handleMyGroupsClick}>
            <i className="fas fa-user-friends icon-left"></i> My Groups
          </button>
        </div>
        
        <div className="dashboard-card payment-history-card">
          <h3><i className="fas fa-history icon-style"></i> Payment History</h3>
          <p>Recent payments will appear here.</p>
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleAccordion('payments')}>
              <h4>Show All Payments</h4>
              <span>{openAccordion === 'payments' ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}</span>
            </div>
            {openAccordion === 'payments' && (
              <div className="accordion-content">
                <p className="info-message">No payment history available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
