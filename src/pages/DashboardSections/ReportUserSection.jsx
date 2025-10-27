import React, { useState } from "react";

/*
  ReportUserSection
  - Enter Group ID -> Fetch group (simulated) -> populate members dropdown
  - Select member to report (cannot report yourself / "You")
  - Reason required, evidence optional
  - Submit disabled until group found + member selected + reason provided
  - Shows spinner while fetching members
  - Replace mock fetch with real API call later
*/

const MOCK_GROUPS = {
  "12345": {
    id: "12345",
    name: "Family Savings",
    members: [
      { id: "m1", name: "Alice", isCreator: false },
      { id: "m2", name: "Bob", isCreator: true },
      { id: "m3", name: "Charlie", isCreator: false },
      { id: "you", name: "You", isCreator: false },
    ],
  },
  "67890": {
    id: "67890",
    name: "Work Colleagues",
    members: [
      { id: "m4", name: "James", isCreator: true },
      { id: "m5", name: "Sarah", isCreator: false },
      { id: "m6", name: "David", isCreator: false },
      { id: "you", name: "You", isCreator: false },
    ],
  },
};

const ReportUserSection = () => {
  const [groupId, setGroupId] = useState("");
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [reportedUserId, setReportedUserId] = useState("");
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // simulate fetching group by ID
  const fetchGroupById = async () => {
    setMessage("");
    setGroup(null);
    setMembers([]);
    setReportedUserId("");
    if (!groupId.trim()) {
      setMessage("Please enter a Group ID.");
      return;
    }

    setLoadingMembers(true);
    // simulate network delay
    setTimeout(() => {
      const found = MOCK_GROUPS[groupId.trim()];
      if (found) {
        setGroup(found);
        // exclude "You" (current user) from the selectable list
        const filtered = found.members.filter((m) => m.name !== "You");
        setMembers(filtered);
        if (filtered.length === 0) {
          setMessage("No other members found in this group.");
        }
      } else {
        setMessage("No group found with this ID.");
      }
      setLoadingMembers(false);
    }, 900);
  };

  const handleEvidenceChange = (e) => {
    setEvidence(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const isFormValid = () =>
    group && reportedUserId && reason.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!isFormValid()) {
      setMessage("Please fill all required fields.");
      return;
    }

    setSubmitting(true);

    // Replace with real API call
    setTimeout(() => {
      const payload = {
        type: "report_user",
        groupId: group.id,
        reportedUserId,
        reason,
        evidence: evidence ? evidence.name : null,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      console.log("Report submitted (mock):", payload);
      setMessage("✅ Report submitted successfully. Status: Pending review.");
      // Reset relevant fields but keep group shown (optionally)
      setReportedUserId("");
      setReason("");
      setEvidence(null);
      setSubmitting(false);
    }, 900);
  };

  return (
    <div className="dispute-form">
      <h2>Report User</h2>

      <form onSubmit={handleSubmit}>
        <label>Group ID (required)</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="Enter Group ID"
            required
          />
          <button type="button" onClick={fetchGroupById} className="submit-btn" style={{ width: 120 }}>
            {loadingMembers ? "Searching..." : "Search"}
          </button>
        </div>

        {loadingMembers && (
          <div className="form-spinner" style={{ marginTop: 12 }}>
            <div className="spinner" />
            <div style={{ marginLeft: 10 }}>Loading group members...</div>
          </div>
        )}

        {group && (
          <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 8 }}>
            <strong>Group:</strong> {group.name} <span style={{ marginLeft: 8, color: "#6b7280" }}>({group.id})</span>
          </div>
        )}

        {members.length > 0 && (
          <>
            <label style={{ marginTop: 12 }}>Select Member to report (required)</label>
            <select
              value={reportedUserId}
              onChange={(e) => setReportedUserId(e.target.value)}
              required
            >
              <option value="">-- Select member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.isCreator ? "(Creator)" : ""}
                </option>
              ))}
            </select>
          </>
        )}

        <label style={{ marginTop: 12 }}>Reason / Description (required)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe what happened..."
          required
        />

        <label style={{ marginTop: 12 }}>Attach Evidence (optional)</label>
        <input type="file" onChange={handleEvidenceChange} accept="image/*,.pdf,.docx" />

        {submitting ? (
          <div className="form-spinner">
            <div className="spinner" />
          </div>
        ) : (
          <button className="submit-btn" type="submit" disabled={!isFormValid()}>
            Submit Report
          </button>
        )}

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </form>
    </div>
  );
};

export default ReportUserSection;
