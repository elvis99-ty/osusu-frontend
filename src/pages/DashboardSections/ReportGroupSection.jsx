// src/pages/DashboardSections/ReportGroupSection.jsx
import React, { useState, useEffect, useRef } from "react";
import "./DisputeForm.css"; // ✅ make sure this is imported

const MOCK_GROUPS = {
  "12345": {
    id: "12345",
    name: "Family Savings",
    members: [
      { id: "m1", name: "Alice", isCreator: false },
      { id: "m2", name: "Bob", isCreator: true },
      { id: "m3", name: "Charlie", isCreator: false },
    ],
  },
  "67890": {
    id: "67890",
    name: "Work Colleagues",
    members: [
      { id: "m4", name: "James", isCreator: true },
      { id: "m5", name: "Sarah", isCreator: false },
      { id: "m6", name: "David", isCreator: false },
    ],
  },
};

const ReportGroupSection = () => {
  const [groupId, setGroupId] = useState("");
  const [group, setGroup] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const debounceRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchGroup = (id) => {
    const trimmed = (id || "").trim();
    setMessage("");
    setGroup(null);
    setCreator(null);

    if (!trimmed) {
      setMessage("Please enter a Group ID.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      const found = MOCK_GROUPS[trimmed];
      if (found) {
        setGroup(found);
        const groupCreator = found.members.find((m) => m.isCreator);
        if (groupCreator) {
          setCreator(groupCreator);
        } else {
          setMessage("No creator found for this group.");
        }
      } else {
        setMessage("No group found with this ID.");
      }
      setLoading(false);
    }, 900);
  };

  // debounce fetch when groupId changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!groupId || !groupId.trim()) {
      setGroup(null);
      setCreator(null);
      setMessage("");
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchGroup(groupId);
      debounceRef.current = null;
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const handleEvidenceChange = (e) => {
    setEvidence(e.target.files?.[0] || null);
  };

  const isFormValid = () => group && creator && reason.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!isFormValid()) {
      setMessage("Please fill all required fields.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      if (!mountedRef.current) return;
      const payload = {
        type: "report_group",
        groupId: group.id,
        creatorId: creator.id,
        reason,
        evidence: evidence ? evidence.name : null,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      console.log("Report group submitted (mock):", payload);
      setMessage("✅ Group report submitted successfully. Status: Pending review.");
      setReason("");
      setEvidence(null);
      setSubmitting(false);
    }, 900);
  };

  return (
    <div className="dispute-form">
      <h2>Report Group</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Group ID (required)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Enter Group ID"
            />
            <button
              type="button"
              onClick={() => fetchGroup(groupId)}
              className="submit-btn"
              style={{ width: 120 }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="form-spinner">
            <div className="spinner" />
            <span>Loading group info...</span>
          </div>
        )}

        {group && (
          <div className="form-info">
            <strong>Group:</strong> {group.name}
            <span style={{ marginLeft: 8, color: "#6b7280" }}>({group.id})</span>
          </div>
        )}

        {creator && (
          <div className="form-group">
            <label>Group Creator</label>
            <select value={creator.id} disabled>
              <option value={creator.id}>
                {creator.name} (Creator)
              </option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Reason / Description (required)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you reporting this group?"
            required
          />
        </div>

        <div className="form-group">
          <label>Attach Evidence (optional)</label>
          <input
            type="file"
            onChange={handleEvidenceChange}
            accept="image/*,.pdf,.docx"
          />
        </div>

        {submitting ? (
          <div className="form-spinner">
            <div className="spinner" />
          </div>
        ) : (
          <button className="submit-btn" type="submit" disabled={!isFormValid()}>
            Submit Report
          </button>
        )}

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default ReportGroupSection;
