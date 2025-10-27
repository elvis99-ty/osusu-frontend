// src/pages/DashboardSections/DisputeForm.jsx
import React, { useState } from "react";
import "./DisputeForm.css";

const DisputeForm = ({ title, fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <div className="dispute-form">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <label>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={handleChange}
              ></textarea>
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        {submitting ? (
          <div className="form-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <button className="submit-btn" type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default DisputeForm;
