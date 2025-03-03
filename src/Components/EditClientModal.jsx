import React, { useState } from 'react';
import './EditClientModal.css';
import { toast } from 'react-toastify';

export default function EditClientModal({ client, onClose, onUpdate }) {
  // Helper function to ensure valid date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Invalid date
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const [editedClient, setEditedClient] = useState({
    ...client,
    subscriptionDate: formatDate(client.subscriptionDate),
    paymentDueDate: formatDate(client.paymentDueDate),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate dates before submitting
    if (!editedClient.subscriptionDate || !editedClient.paymentDueDate) {
      toast.error('Please enter valid dates');
      return;
    }
    onUpdate(editedClient);
  };

  const handleFileChange = (e) => {
    setEditedClient({
      ...editedClient,
      quotationFile: e.target.files[0]
    });
  };

  // Debug log
  console.log('Current edited client:', editedClient);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contact Name:</label>
            <input
              type="text"
              required
              value={editedClient.contactName}
              onChange={(e) => setEditedClient({...editedClient, contactName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              required
              value={editedClient.phoneNumber}
              onChange={(e) => setEditedClient({...editedClient, phoneNumber: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              required
              value={editedClient.location}
              onChange={(e) => setEditedClient({...editedClient, location: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              required
              value={editedClient.email}
              onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Subscription Date:</label>
            <input
              type="date"
              required
              value={editedClient.subscriptionDate}
              onChange={(e) => setEditedClient({
                ...editedClient,
                subscriptionDate: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label>Payment Due Date:</label>
            <input
              type="date"
              required
              value={editedClient.paymentDueDate}
              onChange={(e) => setEditedClient({
                ...editedClient,
                paymentDueDate: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label>Quotation File:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 