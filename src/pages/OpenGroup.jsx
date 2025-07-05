import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

let REACT_APP_API_URL = import.meta.env.VITE_API_URL

const OpenGroups = () => {
  const { user, token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [requestStatus, setRequestStatus] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const calculateEndDate = (startDate, memberLimit, frequency) => {
    const start = new Date(startDate);
    let totalDays = 0;

    switch (frequency) {
      case 'daily':
        totalDays = memberLimit - 1; 
        break;
      case 'weekly':
        totalDays = (memberLimit - 1) * 7;
        break;
      case 'bi-weekly':
        totalDays = (memberLimit - 1) * 14;
        break;
      case 'monthly':
        totalDays = (memberLimit - 1) * 30; 
        break;
      default:
        totalDays = 0;
    }

    const endDate = new Date(start);
    endDate.setDate(start.getDate() + totalDays);
    return endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setMessage({ text: '', type: '' }); 

      if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
      }

      const response = await axios.get(`${REACT_APP_API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filteredGroups = response.data.filter(group => {
          const isMember = group.members.some(member => user && member._id === user._id);
          const hasPendingRequest = group.pendingRequests.some(pendingReq => user && pendingReq.userId && pendingReq.userId._id === user._id);
          const isFull = group.members.length >= group.memberLimit;

          return group.status === 'active' && !isMember && !hasPendingRequest && !isFull;
      });

      setGroups(filteredGroups);

      const initialRequestStatus = {};
      response.data.forEach(group => {
        const userPendingRequest = group.pendingRequests.find(pendingReq => user && pendingReq.userId && pendingReq.userId._id === user._id);
        if (userPendingRequest) {
          initialRequestStatus[group._id] = {
            status: 'pending',
            timestamp: userPendingRequest.timestamp 
          };
        }
      });
      setRequestStatus(initialRequestStatus);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch open groups.');
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token) {
      fetchGroups();
    }
  }, [user, token, fetchGroups]);

  const handleRequestJoin = async (groupId, groupName) => {
    try {
      setMessage({ text: '', type: '' }); 
      setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'sending', timestamp: new Date().toISOString() } })); // Set status to sending with current timestamp

      if (!token) {
          setMessage({ text: 'You must be logged in to join a group.', type: 'error' });
          setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'error', timestamp: null } }));
          return;
      }
      if (!user || !user._id) {
          setMessage({ text: 'User data not fully loaded. Please refresh or relogin.', type: 'error' });
          setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'error', timestamp: null } }));
          return;
      }

        const response = await axios.post(`${REACT_APP_API_URL}/groups/${groupId}/request-join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ text: response.data.message || `Your request to join "${groupName}" has been sent!`, type: 'success' });
      setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'pending', timestamp: new Date().toISOString() } }));
      
      fetchGroups();

    } catch (err) {
      console.error('Error requesting to join group:', err.response?.data || err.message);
      setMessage({ text: err.response?.data?.message || 'Failed to send join request.', type: 'error' });
      setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'error', timestamp: null } }));
    }
  };

  if (loading) {
    return <div className="loading-message">Loading open groups...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-container open-groups-container">
      <div className="open-groups-header">
        <h2><i className="fas fa-handshake-angle icon-style"></i> Explore Open Contribution Circles</h2>
        <p>Find and send requests to join active Susu groups that are accepting new members.</p>
      </div>

      {message.text && (
        <div className={`message-box ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
          {message.text}
        </div>
      )}

      {groups.length === 0 && !loading ? (
        <div className="info-message">No open groups available to join at the moment. Check back later!</div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => {
            const membersRemaining = group.memberLimit - group.members.length;
            const estimatedEndDate = calculateEndDate(group.startDate, group.memberLimit, group.cycleFrequency);
            
            const currentRequest = requestStatus[group._id];
            const status = currentRequest ? currentRequest.status : null;
            const timestamp = currentRequest ? new Date(currentRequest.timestamp) : null;

            const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
            const isExpired = timestamp && (new Date() - timestamp > ONE_DAY_IN_MS);

            const isButtonDisabled = status === 'sending' || (status === 'pending' && !isExpired);

            let buttonText = 'Join Group';
            let buttonIcon = 'fas fa-user-plus';

            if (status === 'sending') {
                buttonText = 'Sending Request...';
                buttonIcon = 'fas fa-spinner fa-spin'; 
            } else if (status === 'pending') {
                if (isExpired) {
                    buttonText = 'Resend Request'; 
                    buttonIcon = 'fas fa-redo'; 
                } else {
                    buttonText = 'Under Review';
                    buttonIcon = 'fas fa-clock';
                }
            } else if (status === 'success') { 
                buttonText = 'Request Sent!';
                buttonIcon = 'fas fa-check-circle'; 
            }

            return (
              <div key={group._id} className="group-card">
                <h3>{group.name}</h3>
                <p><strong>Contribution:</strong> ₦{group.contributionAmount.toLocaleString()}</p>
                <p><strong>Frequency:</strong> {group.cycleFrequency.charAt(0).toUpperCase() + group.cycleFrequency.slice(1)}</p>
                <p><strong>Members:</strong> {group.members.length} / {group.memberLimit}</p>
                <p><strong>Members Remaining:</strong> {membersRemaining}</p>
                <p><strong>Estimated End Date:</strong> {estimatedEndDate}</p>
                {group.description && <p className="group-description">{group.description}</p>}
                <button
                  onClick={() => handleRequestJoin(group._id, group.name)}
                  className={`join-group-button ${isButtonDisabled ? 'disabled' : ''}`}
                  disabled={isButtonDisabled}
                >
                  <i className={`${buttonIcon} icon-left`}></i> {buttonText}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OpenGroups;