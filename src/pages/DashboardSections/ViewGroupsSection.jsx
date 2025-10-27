import React, { useState, useEffect } from "react";
import "./ViewGroupsSection.css";
import { FaCrown } from "react-icons/fa";

const mockGroups = [
  {
    id: 1,
    name: "Family Savings",
    status: "Active",
    creator: "You",
    members: ["Alice", "Bob", "Charlie"],
    nextCollection: "Sept 15, 2025",
    nextPayout: "Sept 20, 2025",
  },
  {
    id: 2,
    name: "Work Colleagues",
    status: "Pending",
    creator: "James",
    members: ["James", "Sarah", "David", "You"],
    nextCollection: "TBD",
    nextPayout: "TBD",
  },
  {
    id: 3,
    name: "Community Project",
    status: "Closed",
    creator: "Lola",
    members: ["Lola", "You", "Ben", "Tina"],
    nextCollection: "-",
    nextPayout: "-",
  },
];

const ViewGroupsSection = () => {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // First show spinner
    const spinnerTimer = setTimeout(() => {
      setShowSkeleton(true); // show skeletons
    }, 1500);

    // Then after skeletons fade, show real data
    const dataTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(dataTimer);
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedGroup(expandedGroup === id ? null : id);
  };

  return (
    <div className="view-groups-container">
      <h2 className="section-title">My Groups</h2>

      {/* Step 1: Spinner */}
      {loading && !showSkeleton && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your groups...</p>
        </div>
      )}

      {/* Step 2: Skeletons */}
      {showSkeleton && loading && (
        <div className="groups-grid">
          {[1, 2].map((i) => (
            <div key={i} className="group-card skeleton fade" />
          ))}
        </div>
      )}

      {/* Step 3: Real Data */}
      {!loading && (
        <div className="groups-grid">
          {mockGroups.map((group) => (
            <div
              key={group.id}
              className={`group-card ${
                expandedGroup === group.id ? "expanded" : ""
              }`}
              onClick={() => toggleExpand(group.id)}
            >
              <div className="group-header">
                <h3 className="group-name">{group.name}</h3>
                <span className={`status-badge ${group.status.toLowerCase()}`}>
                  {group.status}
                </span>
              </div>

              <div className="creator-info">
                <div className="avatar">{group.creator.charAt(0)}</div>
                <span className="creator-name">
                  {group.creator} <FaCrown className="creator-icon" />
                </span>
              </div>

              {expandedGroup === group.id && (
                <div className="group-details">
                  <div className="detail-row">
                    <strong>Next Collection:</strong> {group.nextCollection}
                  </div>
                  <div className="detail-row">
                    <strong>Next Payout:</strong> {group.nextPayout}
                  </div>
                  <div className="detail-row members">
                    <strong>Members:</strong>
                    <div className="member-list">
                      {group.members.map((member, index) => (
                        <div key={index} className="member-item">
                          <div className="avatar">{member.charAt(0)}</div>
                          <span>{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewGroupsSection;
