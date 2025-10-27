import React, { useState, useEffect } from "react";
import "./ProfileSection.css";

const ProfileSection = () => {
  const [step, setStep] = useState(1);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState({
    phone: false,
    email: false,
    id: false,
    account: false,
  });
  const [verified, setVerified] = useState({
    phone: false,
    email: false,
    id: false,
    account: false,
  });

  const [formData, setFormData] = useState({
    profilePic: null,
    fullName: "",
    dob: "",
    gender: "",
    occupation: "",
    incomeRange: "",
    phone: "",
    email: "",
    idType: "", // "bvn" or "nin"
    bvn: "",
    address: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    idUpload: null,
    emergencyContact: "",
    pin: "",
    confirmPin: "",
  });

  const [isNextDisabled, setIsNextDisabled] = useState(true);

  // Validate current step whenever formData, verified flags or photoSaved change
  useEffect(() => {
    validateStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, verified, photoSaved, step]);

  const validateStep = () => {
    let valid = false;

    if (step === 1) {
      valid =
        formData.fullName.trim().length >= 2 &&
        formData.dob &&
        formData.gender &&
        formData.occupation.trim().length >= 2 &&
        formData.incomeRange &&
        photoSaved;
    } else if (step === 2) {
      valid =
        formData.phone.trim().length >= 7 && // minimal sanity check
        verified.phone &&
        formData.email.trim().length > 5 &&
        verified.email &&
        (formData.idType === "bvn" || formData.idType === "nin") &&
        formData.bvn.trim().length > 0 &&
        verified.id &&
        formData.address.trim().length > 5;
    } else if (step === 3) {
      valid =
        formData.bankName &&
        /^\d{10}$/.test(formData.accountNumber) &&
        verified.account &&
        formData.accountName.trim().length > 0;
    } else if (step === 4) {
      valid =
        formData.idUpload !== null &&
        formData.emergencyContact.trim().length > 6 &&
        /^\d{4,6}$/.test(formData.pin) &&
        formData.pin === formData.confirmPin;
    }

    setIsNextDisabled(!valid);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (name === "profilePic" && files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]);
      setPreview(imageURL);
    }
  };

  const savePhoto = () => {
    if (formData.profilePic) {
      setPhotoSaved(true);
      alert("Profile photo saved!");
    } else {
      alert("Please upload a photo first.");
    }
  };

  const handleVerify = (field) => {
    // Prevent verifying if required input absent
    if (field === "phone" && !formData.phone.trim()) {
      return alert("Enter phone number first.");
    }
    if (field === "email" && !formData.email.trim()) {
      return alert("Enter email address first.");
    }
    if (field === "id" && !formData.bvn.trim()) {
      return alert("Enter BVN or NIN first.");
    }
    if (
      field === "account" &&
      (!formData.bankName || !/^\d{10}$/.test(formData.accountNumber))
    ) {
      return alert("Enter bank name and a valid 10-digit account number first.");
    }

    setLoading((prev) => ({ ...prev, [field]: true }));

    // Simulate async verification (replace with real API later)
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [field]: false }));
      setVerified((prev) => ({ ...prev, [field]: true }));

      if (field === "account") {
        // Simulated auto-filled account name after verification
        setFormData((prev) => ({ ...prev, accountName: "John Doe" }));
      }
    }, 1200);
  };

  const nextStep = () => {
    if (!isNextDisabled && step < 4) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now show collected data in console (dummy)
    console.log("Profile saved (dummy):", formData);
    alert("Profile saved (dummy). We'll integrate backend next.");
  };

  // Small bank list (extendable)
  const banks = [
    "Access Bank",
    "GTBank",
    "First Bank",
    "Zenith Bank",
    "UBA",
    "FCMB",
    "Fidelity Bank",
    "Ecobank",
    "Union Bank",
    "Wema Bank",
    "Polaris Bank",
    "Stanbic IBTC",
    "Sterling Bank",
    "Heritage Bank",
    "Jaiz Bank",
    "Keystone Bank",
    "Providus Bank",
    "SunTrust Bank",
  ];

  return (
    <div className="profile-container">
      <h2 className="profile-title">CREATE YOUR PROFILE</h2>

      <div className="stepper" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`step ${step === n ? "active" : ""} ${step > n ? "completed" : ""}`}
          >
            <div className="circle">{n}</div>
            <span>Step {n}</span>
          </div>
        ))}
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        {/* --- STEP 1 --- */}
        {step === 1 && (
          <div className="form-card">
            <h3>PERSONAL INFORMATION</h3>

            <div className="profile-pic-upload">
              <div className="image-preview">{preview ? <img src={preview} alt="Profile" /> : <span>+</span>}</div>

              {!photoSaved ? (
                <div className="profile-pic-actions">
                  <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
                  <button type="button" className="btn small" onClick={savePhoto}>
                    Save Photo
                  </button>
                </div>
              ) : (
                <div className="photo-saved-badge">Photo saved ✓</div>
              )}
            </div>

            <label>Full name</label>
            <input
              name="fullName"
              placeholder="e.g., Adaeze Chukwu"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Date of birth</label>
            <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            <label>Occupation / Employment status</label>
            <input name="occupation" placeholder="e.g., Software Engineer" value={formData.occupation} onChange={handleChange} required />

            <label>Annual income range</label>
            <select name="incomeRange" value={formData.incomeRange} onChange={handleChange} required>
              <option value="">Select range</option>
              <option value="below-500k">Below ₦500,000</option>
              <option value="500k-1m">₦500,000 - ₦1,000,000</option>
              <option value="1m-5m">₦1,000,000 - ₦5,000,000</option>
              <option value="above-5m">Above ₦5,000,000</option>
            </select>
          </div>
        )}

        {/* --- STEP 2 --- */}
        {step === 2 && (
          <div className="form-card">
            <h3>CONTACT & IDENTITY</h3>

            <label>Phone number</label>
            <div className="verify-group">
              <input name="phone" placeholder="e.g., 08012345678" value={formData.phone} onChange={handleChange} />
              <button
                type="button"
                className={`verify-btn ${verified.phone ? "verified" : ""}`}
                disabled={!formData.phone.trim() || loading.phone || verified.phone}
                onClick={() => handleVerify("phone")}
              >
                {loading.phone ? "Verifying..." : verified.phone ? "Verified ✓" : "Verify"}
              </button>
            </div>

            <label>Email address</label>
            <div className="verify-group">
              <input name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
              <button
                type="button"
                className={`verify-btn ${verified.email ? "verified" : ""}`}
                disabled={!formData.email.trim() || loading.email || verified.email}
                onClick={() => handleVerify("email")}
              >
                {loading.email ? "Verifying..." : verified.email ? "Verified ✓" : "Verify"}
              </button>
            </div>

            <label>BVN / NIN</label>
            <div className="checkbox-group">
              <label>
                <input type="radio" name="idType" value="bvn" checked={formData.idType === "bvn"} onChange={handleChange} /> BVN
              </label>
              <label>
                <input type="radio" name="idType" value="nin" checked={formData.idType === "nin"} onChange={handleChange} /> NIN
              </label>
            </div>

            <div className="verify-group">
              <input name="bvn" placeholder="Enter BVN or NIN" value={formData.bvn} onChange={handleChange} />
              <button
                type="button"
                className={`verify-btn ${verified.id ? "verified" : ""}`}
                disabled={!formData.bvn.trim() || loading.id || verified.id}
                onClick={() => handleVerify("id")}
              >
                {loading.id ? "Verifying..." : verified.id ? "Verified ✓" : "Verify"}
              </button>
            </div>

            <label>Residential address</label>
            <textarea name="address" rows="3" placeholder="Street, City, State" value={formData.address} onChange={handleChange} />
          </div>
        )}

        {/* --- STEP 3 --- */}
        {step === 3 && (
          <div className="form-card">
            <h3>BANK DETAILS</h3>

            <label>Bank name</label>
            <select name="bankName" value={formData.bankName} onChange={handleChange}>
              <option value="">Select bank</option>
              {banks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <label>Account number</label>
            <div className="verify-group">
              <input
                name="accountNumber"
                placeholder="10-digit account number"
                value={formData.accountNumber}
                onChange={(e) => {
                  // accept digits only
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, accountNumber: val }));
                }}
                maxLength={10}
              />
              <button
                type="button"
                className={`verify-btn ${verified.account ? "verified" : ""}`}
                disabled={!formData.bankName || !/^\d{10}$/.test(formData.accountNumber) || loading.account || verified.account}
                onClick={() => handleVerify("account")}
              >
                {loading.account ? "Verifying..." : verified.account ? "Verified ✓" : "Verify"}
              </button>
            </div>

            <label>Account name</label>
            <input name="accountName" placeholder="Auto-filled after verification" value={formData.accountName} readOnly />
            <small className="muted">Account name auto-fills after successful verification (simulated).</small>
          </div>
        )}

        {/* --- STEP 4 --- */}
        {step === 4 && (
          <div className="form-card">
            <h3>SECURITY & VERIFICATION</h3>

            <label>Upload ID (National ID, Driver's License, Passport)</label>
            <input type="file" name="idUpload" accept="image/*,application/pdf" onChange={handleChange} />

            <label>Emergency contact</label>
            <input name="emergencyContact" placeholder="Contact name & phone" value={formData.emergencyContact} onChange={handleChange} />

            <label>Create transaction PIN</label>
            <input type="password" name="pin" placeholder="4-6 digit PIN" value={formData.pin} onChange={(e) => setFormData((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))} maxLength={6} />

            <label>Confirm PIN</label>
            <input type="password" name="confirmPin" placeholder="Confirm PIN" value={formData.confirmPin} onChange={(e) => setFormData((p) => ({ ...p, confirmPin: e.target.value.replace(/\D/g, "") }))} maxLength={6} />

            <div className="muted">PIN must match and be 4-6 digits.</div>
          </div>
        )}

        <div className="button-group">
          {step > 1 && (
            <button type="button" className="btn secondary" onClick={prevStep}>
              Back
            </button>
          )}

          {step < 4 && (
            <button type="button" className={`btn primary ${isNextDisabled ? "disabled" : ""}`} disabled={isNextDisabled} onClick={nextStep}>
              Next
            </button>
          )}

          {step === 4 && (
            <button type="submit" className="btn submit">
              Finish & Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
