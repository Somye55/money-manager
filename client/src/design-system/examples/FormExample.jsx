import React, { useState } from "react";
import {
  FormField,
  Input,
  Button,
  IconButton,
  ValidationMessage,
  LoadingSpinner,
} from "../index.js";

const FormExample = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted successfully!");
    }, 2000);
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem" }}>
      <h2>Form Components Example</h2>

      <form onSubmit={handleSubmit}>
        <FormField label="Full Name" error={errors.name} required fullWidth>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
        </FormField>

        <FormField
          label="Email Address"
          error={errors.email}
          required
          fullWidth
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange("email")}
          />
        </FormField>

        <FormField label="Password" error={errors.password} required fullWidth>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange("password")}
              style={{ paddingRight: "3rem" }}
            />
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.5rem",
                zIndex: 1,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </IconButton>
          </div>
        </FormField>

        <ValidationMessage
          type="info"
          message="All fields are required. Password must be at least 6 characters."
          visible={Object.keys(errors).length === 0}
        />

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {loading ? "Submitting..." : "Submit Form"}
          </Button>

          {loading && <LoadingSpinner size="md" color="primary" />}
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <IconButton variant="outline" size="sm">
            📝
          </IconButton>
          <IconButton variant="ghost" size="sm">
            🗑️
          </IconButton>
          <IconButton variant="danger" size="sm">
            ❌
          </IconButton>
          <IconButton variant="primary" size="lg">
            ✅
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default FormExample;
