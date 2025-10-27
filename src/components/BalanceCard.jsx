import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);

  // Dummy balance (later from backend)
  const balance = 50000000;

  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(balance);

  return (
    <div className="balance-card">
      <h3>Available Balance</h3>
      <p className="balance-amount">
        {showBalance ? formattedBalance : "••••••"}
      </p>

      {/* ✅ Standalone toggle inside card */}
      <button
        className="balance-toggle"
        onClick={() => setShowBalance(!showBalance)}
      >
        {showBalance ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default BalanceCard;