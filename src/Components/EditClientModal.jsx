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

  // Helper function to extract month and day from date
  const extractMonthDay = (dateString) => {
    if (!dateString) return { month: '', day: '' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { month: '', day: '' }; // Invalid date
      return {
        month: (date.getMonth() + 1).toString().padStart(2, '0'), // Months are 0-indexed
        day: date.getDate().toString().padStart(2, '0')
      };
    } catch (error) {
      console.error('Date extraction error:', error);
      return { month: '', day: '' };
    }
  };

  const [editedClient, setEditedClient] = useState({
    ...client,
    subscriptionDate: formatDate(client.subscriptionDate),
    paymentDueDate: formatDate(client.paymentDueDate),
  });

  // Extract month and day for payment due date
  const [paymentDueMonthDay, setPaymentDueMonthDay] = useState(
    extractMonthDay(client.paymentDueDate)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate dates before submitting
    if (!editedClient.subscriptionDate) {
      toast.error('Please enter a valid subscription date');
      return;
    }
    
    if (!paymentDueMonthDay.month || !paymentDueMonthDay.day) {
      toast.error('Please enter a valid payment due date');
      return;
    }
    
    // Create a full date for the payment due date using the current year
    const currentYear = new Date().getFullYear();
    const paymentDueDate = new Date(
      currentYear, 
      parseInt(paymentDueMonthDay.month) - 1, 
      parseInt(paymentDueMonthDay.day)
    );
    
    // Check if date is valid
    if (isNaN(paymentDueDate.getTime())) {
      toast.error('Invalid payment due date');
      console.error('Invalid payment due date:', paymentDueMonthDay);
      return;
    }
    
    // If the date has already passed this year, we might want to use next year
    // Uncomment this if you want to always use a future date
    /*
    if (paymentDueDate < new Date()) {
      paymentDueDate.setFullYear(currentYear + 1);
    }
    */
    
    // Update the client with the new payment due date
    const updatedClient = {
      ...editedClient,
      paymentDueDate: paymentDueDate.toISOString()
    };
    
    console.log('Submitting updated client:', updatedClient);
    onUpdate(updatedClient);
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
            <label>Payment Due Date (Monthly Recurring):</label>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Month:</label>
                <select
                  required
                  value={paymentDueMonthDay.month}
                  onChange={(e) => setPaymentDueMonthDay({
                    ...paymentDueMonthDay,
                    month: e.target.value
                  })}
                >
                  <option value="">Select Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div className="date-input-group">
                <label>Day:</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={paymentDueMonthDay.day}
                  onChange={(e) => {
                    const value = e.target.value;
                    const day = value === '' ? '' : 
                      Math.max(1, Math.min(31, parseInt(value))).toString().padStart(2, '0');
                    setPaymentDueMonthDay({
                      ...paymentDueMonthDay,
                      day
                    });
                  }}
                />
              </div>
            </div>
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