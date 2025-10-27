// src/pages/Transaction.jsx
import React, { useState, useEffect } from "react";

// Mock transactions
const MOCK_TRANSACTIONS = [
  {
    id: "txn001",
    amount: 5000,
    type: "Contribution",
    status: "Completed",
    date: "2025-09-01",
  },
  {
    id: "txn002",
    amount: 2000,
    type: "Withdrawal",
    status: "Pending",
    date: "2025-09-03",
  },
  {
    id: "txn003",
    amount: 10000,
    type: "Contribution",
    status: "Failed",
    date: "2025-09-04",
  },
];

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportingTxn, setReportingTxn] = useState(null);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [disabledReports, setDisabledReports] = useState({});

  useEffect(() => {
    setTransactions(MOCK_TRANSACTIONS);
  }, []);

  const handleReportClick = (txn) => {
    if (disabledReports[txn.id]) return;
    setReportingTxn(txn);
    setReason("");
    setEvidence(null);
    setSuccessMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("✅ Your report has been logged.");
      // disable this report button for 3hrs
      setDisabledReports((prev) => ({
        ...prev,
        [reportingTxn.id]: Date.now() + 3 * 60 * 60 * 1000,
      }));

      // auto-close after 2s
      setTimeout(() => {
        setReportingTxn(null);
        setSuccessMsg("");
      }, 2000);
    }, 1200);
  };

  // check if report button is disabled for txn
  const isReportDisabled = (id) => {
    const expiry = disabledReports[id];
    return expiry && Date.now() < expiry;
  };

  return (
    <div className="transactions-page">
      <h2 className="page-title">My Transactions</h2>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>₦{txn.amount.toLocaleString()}</td>
                <td>{txn.type}</td>
                <td
                  className={
                    txn.status === "Completed"
                      ? "status-completed"
                      : txn.status === "Pending"
                      ? "status-pending"
                      : "status-failed"
                  }
                >
                  {txn.status}
                </td>
                <td>{txn.date}</td>
                <td>
                  <button
                    className="submit-btn"
                    type="button"
                    onClick={() => handleReportClick(txn)}
                    disabled={isReportDisabled(txn.id)}
                    title={
                      isReportDisabled(txn.id)
                        ? "You can only report again after 3 hours."
                        : "Report this transaction"
                    }
                  >
                    {isReportDisabled(txn.id) ? "Reported" : "Report"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {reportingTxn && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Report Transaction</h3>
              <button
                className="close-btn"
                onClick={() => setReportingTxn(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Transaction ID</label>
              <input type="text" value={reportingTxn.id} disabled />

              <label>Reason / Description</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Why are you reporting this transaction?"
              />

              <label>Attach Evidence (optional)</label>
              <div className="evidence-upload">
                <input
                  type="file"
                  id="evidence"
                  accept="image/*,.pdf,.docx"
                  onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                />
                {evidence && (
                  <p className="file-info">📎 {evidence.name}</p>
                )}
              </div>

              {loading ? (
                <div className="form-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <button type="submit" className="submit-btn">
                  Submit Report
                </button>
              )}

              {successMsg && <p style={{ marginTop: 12 }}>{successMsg}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;