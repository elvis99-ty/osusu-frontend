// susu-flow-frontend/src/pages/OpenGroups.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Link } from 'react-router-dom'; // Import Link if used for navigation within cards

const OpenGroups = () => {
  const { user, token } = useAuth(); // Get user and token from AuthContext
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // requestStatus now stores an object for each group: { groupId: { status: 'pending' | 'success' | 'error' | 'sending', timestamp: ISOString } }
  const [requestStatus, setRequestStatus] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  // Function to calculate estimated end date
  const calculateEndDate = (startDate, memberLimit, frequency) => {
    const start = new Date(startDate);
    let totalDays = 0;

    // This is a simplified calculation: it assumes a new cycle starts immediately after the previous one finishes.
    // For more accuracy, you might consider actual working days or a more complex calendar logic.
    switch (frequency) {
      case 'daily':
        totalDays = memberLimit - 1; // If 5 members, 4 additional days from start
        break;
      case 'weekly':
        totalDays = (memberLimit - 1) * 7;
        break;
      case 'bi-weekly':
        totalDays = (memberLimit - 1) * 14;
        break;
      case 'monthly':
        totalDays = (memberLimit - 1) * 30; // Approximation for monthly
        break;
      default:
        totalDays = 0;
    }

    const endDate = new Date(start);
    endDate.setDate(start.getDate() + totalDays);
    return endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Memoized function to fetch groups to prevent unnecessary re-creations
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setMessage({ text: '', type: '' }); // Clear any general messages

      if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
      }

      const response = await axios.get('http://localhost:4009/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter groups:
      // 1. Status is 'active'
      // 2. User is NOT already a member of the group
      // 3. Group has NOT reached its member limit
      const filteredGroups = response.data.filter(group => {
          const isMember = group.members.some(member => user && member._id === user._id);
          // MODIFIED: Access userId._id from pendingRequests object
          const hasPendingRequest = group.pendingRequests.some(pendingReq => user && pendingReq.userId && pendingReq.userId._id === user._id);
          const isFull = group.members.length >= group.memberLimit;

          return group.status === 'active' && !isMember && !hasPendingRequest && !isFull;
      });

      setGroups(filteredGroups);

      // Initialize request status for groups that the user might have already requested
      // This ensures the "Under Review" state persists across sessions/reloads
      const initialRequestStatus = {};
      response.data.forEach(group => {
        // MODIFIED: Access userId._id and store timestamp
        const userPendingRequest = group.pendingRequests.find(pendingReq => user && pendingReq.userId && pendingReq.userId._id === user._id);
        if (userPendingRequest) {
          initialRequestStatus[group._id] = {
            status: 'pending',
            timestamp: userPendingRequest.timestamp // Store the timestamp from the backend
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
  }, [user, token]); // Dependencies for useCallback: user and token

  // Effect hook to call fetchGroups when component mounts or user/token changes
  useEffect(() => {
    if (user && token) {
      fetchGroups();
    }
  }, [user, token, fetchGroups]); // Dependency array: fetchGroups itself is a dependency now

  const handleRequestJoin = async (groupId, groupName) => {
    try {
      setMessage({ text: '', type: '' }); // Clear any previous messages
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

      const response = await axios.post(`http://localhost:4009/api/groups/${groupId}/request-join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ text: response.data.message || `Your request to join "${groupName}" has been sent!`, type: 'success' });
      // MODIFIED: Store 'pending' status with current timestamp (from backend or local if not returned)
      setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'pending', timestamp: new Date().toISOString() } }));
      
      // Refetch groups to ensure the list is updated and the group with pending request is removed
      fetchGroups();

    } catch (err) {
      console.error('Error requesting to join group:', err.response?.data || err.message);
      setMessage({ text: err.response?.data?.message || 'Failed to send join request.', type: 'error' });
      setRequestStatus(prev => ({ ...prev, [groupId]: { status: 'error', timestamp: null } })); // Set status to error
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
            // Calculate derived state for each group
            const membersRemaining = group.memberLimit - group.members.length;
            const estimatedEndDate = calculateEndDate(group.startDate, group.memberLimit, group.cycleFrequency);
            
            // Determine button state based on local state and fetched pending requests
            const currentRequest = requestStatus[group._id];
            const status = currentRequest ? currentRequest.status : null;
            const timestamp = currentRequest ? new Date(currentRequest.timestamp) : null;

            const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
            const isExpired = timestamp && (new Date() - timestamp > ONE_DAY_IN_MS);

            // Button is disabled if it's currently sending or pending (and not expired)
            const isButtonDisabled = status === 'sending' || (status === 'pending' && !isExpired);

            let buttonText = 'Join Group';
            let buttonIcon = 'fas fa-user-plus';

            if (status === 'sending') {
                buttonText = 'Sending Request...';
                buttonIcon = 'fas fa-spinner fa-spin'; // Spinner icon
            } else if (status === 'pending') {
                if (isExpired) {
                    buttonText = 'Resend Request'; // MODIFIED: Button text for expired requests
                    buttonIcon = 'fas fa-redo'; // MODIFIED: Icon for resend
                } else {
                    buttonText = 'Under Review';
                    buttonIcon = 'fas fa-clock'; // Clock icon
                }
            } else if (status === 'success') { // This state is set transiently after a successful send
                buttonText = 'Request Sent!';
                buttonIcon = 'fas fa-check-circle'; // Checkmark icon
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
