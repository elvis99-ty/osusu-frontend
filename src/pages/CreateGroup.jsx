import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [memberLimit, setMemberLimit] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSuccessState, setShowSuccessState] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    setShowSuccessState(false);

    if (
      !groupName.trim() ||
      !contributionAmount ||
      Number(contributionAmount) < 1000 ||
      !memberLimit ||
      Number(memberLimit) < 2 ||
      !frequency ||
      !startDate.trim()
    ) {
      setMessage('Please fill in all required fields correctly (Group Name, Amount, Members, Frequency, Start Date).');
      setIsError(true);
      setLoading(false);
      return;
    }

    let formattedStartDate = startDate;
    try {
        if (startDate) {
            formattedStartDate = new Date(startDate).toISOString();
        }
    } catch (dateError) {
        console.error("Date formatting error:", dateError);
        setMessage('Invalid start date format.');
        setIsError(true);
        setLoading(false);
        return;
    }

    const payload = {
      name: groupName.trim(),
      contributionAmount: Number(contributionAmount),
      memberLimit: Number(memberLimit),
      frequency: frequency.trim().toLowerCase(),
      startDate: formattedStartDate,
      description: description.trim(),
    };

    console.log('Sending payload:', payload);

    try {
      const response = await axios.post(
        'http://localhost:4009/api/groups/create',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Group created successfully!');
      setIsError(false);
      setShowSuccessState(true); 
      console.log('Group created:', response.data);

      setGroupName('');
      setContributionAmount('');
      setMemberLimit('');
      setFrequency('weekly');
      setStartDate('');
      setDescription('');

    } catch (error) {
      console.error('Error creating group:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to create group. Please check your inputs and try again.');
      setIsError(true);
      setShowSuccessState(false); 
    } finally {
      setLoading(false);
    }
  };

  const handleGoToMyGroups = () => {
    navigate('/my-groups');
  };

  const handleCreateAnotherGroup = () => {
    setShowSuccessState(false);
    setMessage(''); 
    setIsError(false);
  };


  return (
    <div className="page-container create-group-container">
      <div className="form-card colorful-gradient">
        <h2><i className="fas fa-users-medical icon-style"></i> Create New Group</h2>
        <p className="form-description">
          Set up your new Susu contribution circle by filling out the details below.
        </p>

        {message && !showSuccessState && ( 
          <div className={`message-box ${isError ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        )}

        {showSuccessState ? (
          <div className="group-creation-success-card">
            <i className="fas fa-check-circle success-icon"></i>
            <h3>Group Created Successfully!</h3>
            <p>Your new Susu contribution circle is ready. You can now:</p>
            <div className="success-actions">
              <button onClick={handleGoToMyGroups} className="success-button primary-button">
                <i className="fas fa-users-class icon-left"></i> Go to My Groups
              </button>
              <button onClick={handleCreateAnotherGroup} className="success-button secondary-button">
                <i className="fas fa-plus-circle icon-left"></i> Create Another Group
              </button>
            </div>
          </div>
        ) : (
         
          <form onSubmit={handleSubmit} className="group-form">
            <div className="form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contributionAmount">Contribution Amount (₦)</label>
              <input
                type="number"
                id="contributionAmount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Minimum ₦1000"
                min="1000"
                step="1"
                required
                inputMode="numeric"
              />
            </div>

            <div className="form-group">
              <label htmlFor="memberLimit">Member Limit</label>
              <input
                type="number"
                id="memberLimit"
                value={memberLimit}
                onChange={(e) => setMemberLimit(e.target.value)}
                placeholder="Minimum 2"
                min="2"
                step="1"
                required
                inputMode="numeric"
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Contribution Frequency</label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your group's goal..."
                rows="3"
              ></textarea>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : 'Create Group'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;