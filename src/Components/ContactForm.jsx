import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase";

// Initialize Firebase Functions
const functions = getFunctions(app, "us-central1");

const ResizableInput = ({ placeholder, value, onChange }) => {
  const [fontSize, setFontSize] = useState(window.innerWidth <= 768 ? 16 : 14);

  const handleInput = (event) => {
    const input = event.target;
    const maxWidth = input.clientWidth;
    const textWidth = input.scrollWidth;

    if (textWidth > maxWidth) {
      setFontSize((prevSize) => Math.max(prevSize - 1, window.innerWidth <= 768 ? 12 : 8));
    } else {
      setFontSize(window.innerWidth <= 768 ? 16 : 14);
    }

    onChange(event);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth <= 768 ? 16 : 14);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <input
      className="app-form-control"
      placeholder={placeholder}
      value={value}
      style={{
        fontSize: `${fontSize}px`,
        transition: "font-size 0.2s ease",
        padding: window.innerWidth <= 768 ? "15px 0" : "10px 0",
      }}
      onInput={handleInput}
      onChange={handleInput}
    />
  );
};

ResizableInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { placeholder, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [placeholder.toLowerCase()]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const sendContactEmail = httpsCallable(functions, "sendContactEmail");
      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        message: formData.message
      });

      if (result.data.error) {
        throw new Error(result.data.error);
      }

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-form">
      <div className="app-form-group">
        <ResizableInput
          placeholder="NAME"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group">
        <ResizableInput
          placeholder="EMAIL"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group">
        <ResizableInput
          placeholder="PHONE"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group message">
        <ResizableInput
          placeholder="MESSAGE"
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group buttons">
        <button
          className="app-form-button"
          onClick={() => setFormData({ name: "", email: "", phone: "", message: "" })}
        >
          CANCEL
        </button>
        <button
          className="app-form-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "SENDING..." : "SEND"}
        </button>
      </div>
    </div>
  );
} 