import React, { useState } from "react";
import "./DashboardForm.css"; // keep same styling

const ReportTransactionModal = ({ transactionId, onClose }) => {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEvidenceChange = (e) => {
    setEvidence(e.target.files?.[0] || null);
  };

  const isFormValid = () => reason.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!isFormValid()) {
      setMessage("⚠ Please provide a reason for reporting.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const payload = {
        type: "report_transaction",
        transactionId,
        reason,
        evidence: evidence ? evidence.name : null,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      console.log("Transaction report submitted (mock):", payload);
      setMessage("✅ Report submitted successfully. Status: Pending review.");
      setReason("");
      setEvidence(null);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content dispute-form">
        <h2>Report Transaction</h2>

        <form onSubmit={handleSubmit}>
          <label>Transaction ID</label>
          <input type="text" value={transactionId} disabled />

          <label style={{ marginTop: 12 }}>Reason (required)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you reporting this transaction?"
            required
          />

          <label style={{ marginTop: 12 }}>Attach Evidence (optional)</label>
          <input
            type="file"
            onChange={handleEvidenceChange}
            accept="image/*,.pdf,.docx"
          />

          {submitting ? (
            <div className="form-spinner">
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                className="submit-btn"
                type="submit"
                disabled={!isFormValid()}
              >
                Submit Report
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          )}

          {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ReportTransactionModal;
