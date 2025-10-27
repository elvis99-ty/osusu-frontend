import React, { useState, useEffect } from "react";
import "./JoinGroupSection.css";

const JoinGroupSection = () => {
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupResults, setGroupResults] = useState(null);

  const [joining, setJoining] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | pending | expired
  const [timeLeft, setTimeLeft] = useState(null);

  const fakeGroup = {
    name: "SuSu Savings Group",
    id: "GRP12345",
    amount: "5000",
    cycle: "Weekly",
    startDate: "2025-09-10",
    membersJoined: 4,
    membersRequired: 7,
  };

  const handleSearch = (type) => {
    setLoading(true);
    setGroupResults(null);
    setStatus("idle");

    // simulate 20s loading (using 2s here for demo)
    setTimeout(() => {
      setLoading(false);
      setGroupResults(fakeGroup);
    }, 2000);
  };

  const handleJoin = () => {
    setJoining(true);

    setTimeout(() => {
      setJoining(false);
      setStatus("success");

      // after small delay, move to pending + countdown
      setTimeout(() => {
        setStatus("pending");
        setTimeLeft(20); // demo: 20s, later: 4 days in seconds
      }, 2000);
    }, 1500);
  };

  // countdown effect
  useEffect(() => {
    if (status === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (status === "pending" && timeLeft === 0) {
      setStatus("expired");
    }
  }, [status, timeLeft]);

  const handleResend = () => {
    setStatus("success");

    setTimeout(() => {
      setStatus("pending");
      setTimeLeft(20); // restart countdown
    }, 2000);
  };

  return (
    <div className="join-group-container">
      <h1>Join a Group</h1>

      <div className="search-section">
        {/* Search by ID */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Group ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={() => handleSearch("id")}>Search by ID</button>
        </div>

        {/* Search by Name */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Group Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={() => handleSearch("name")}>Search by Name</button>
        </div>
      </div>

      {/* Divider Line */}
      <div className="divider"></div>

      {/* Loading Spinner */}
      {loading && <div className="spinner"></div>}

      {/* Results */}
      {!loading && groupResults && (
        <div className="group-results">
          <div className="group-card">
            <h2>{groupResults.name}</h2>
            <p><strong>ID:</strong> {groupResults.id}</p>
            <p><strong>Amount:</strong> ₦{groupResults.amount}</p>
            <p><strong>Cycle:</strong> {groupResults.cycle}</p>
            <p><strong>Start Date:</strong> {groupResults.startDate}</p>
            <p>
              <strong>Members:</strong>{" "}
              {groupResults.membersJoined}/{groupResults.membersRequired}
            </p>

            {/* Join / Status */}
            {status === "idle" && (
              <button onClick={handleJoin} disabled={joining}>
                {joining ? "Sending..." : "Join Group"}
              </button>
            )}

            {status === "success" && (
              <p className="success-message">
                ✅ Your request has been sent to the group owner...
              </p>
            )}

            {status === "pending" && (
              <p className="pending-message">
                ⏳ Request pending approval ({timeLeft}s left)
              </p>
            )}

            {status === "expired" && (
              <div className="expired-section">
                <p className="error-message">
                  ⚠️ Request expired. Please resend.
                </p>
                <button onClick={handleResend}>Resend Request</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinGroupSection;
