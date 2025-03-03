import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ManagementDashboard.css';
import { useNavigate } from 'react-router-dom';
import EditClientModal from '../components/EditClientModal';

export default function ManagementDashboard() {
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [overdueClients, setOverdueClients] = useState([]);
  const [newClient, setNewClient] = useState({
    contactName: '',
    phoneNumber: '',
    location: '',
    email: '',
    subscriptionDate: '',
    paymentDueDate: '',
    quotationFile: null,
    paymentHistory: []
  });
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.MODE === 'development';
  const API_BASE_URL = isDevelopment 
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_RENDER_API_URL || 'https://nextgem-backend.onrender.com');

  // Debug log to check the URL and environment
  console.log('Environment:', import.meta.env.MODE);
  console.log('API URL:', API_BASE_URL);

  // Fetch clients on component mount
  useEffect(() => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      toast.error('Configuration error: API URL not found');
      return;
    }
    fetchClients();
    checkPaymentDues();
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission === 'granted');
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  const fetchClients = async () => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/clients`);
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Raw response:', text); // Debug log
      
      try {
        const data = JSON.parse(text);
        setClients(data);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Response that failed to parse:', text);
        toast.error('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error(error.message || 'Failed to load clients');
    }
  };

  const handleFileChange = (e) => {
    setNewClient({
      ...newClient,
      quotationFile: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const formattedClient = {
      ...newClient,
      subscriptionDate: new Date(newClient.subscriptionDate).toISOString(),
      paymentDueDate: new Date(newClient.paymentDueDate).toISOString()
    };

    console.log('Submitting client data:', formattedClient);

    Object.keys(formattedClient).forEach(key => {
      if (formattedClient[key] !== null && key !== 'paymentHistory') {
        formData.append(key, formattedClient[key]);
      }
    });

    // Debug: Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      let errorData;
      if (!response.ok) {
        try {
          errorData = await response.json();
          console.log('Error response:', errorData);
        } catch (e) {
          errorData = { error: 'Failed to parse error response' };
        }
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to add client');
      }

      const data = await response.json();
      toast.success('Client added successfully');
      setShowAddForm(false);
      fetchClients();
      setNewClient({
        contactName: '',
        phoneNumber: '',
        location: '',
        email: '',
        subscriptionDate: '',
        paymentDueDate: '',
        quotationFile: null,
        paymentHistory: []
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error(error.message || 'Failed to add client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
  };

  const handleUpdate = async (updatedClient) => {
    const formData = new FormData();
    const formattedClient = {
      ...updatedClient,
      subscriptionDate: new Date(updatedClient.subscriptionDate).toISOString(),
      paymentDueDate: new Date(updatedClient.paymentDueDate).toISOString()
    };

    Object.keys(formattedClient).forEach(key => {
      if (formattedClient[key] !== null && key !== 'paymentHistory') {
        formData.append(key, formattedClient[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${updatedClient.id || updatedClient._id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update client');
      }

      toast.success('Client updated successfully');
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(error.message || 'Failed to update client');
    }
  };

  const showNotification = (title, body) => {
    if (notificationPermission) {
      new Notification(title, {
        body,
        icon: '/path/to/your/icon.png', // Add your icon path here
      });
    }
  };

  const checkPaymentDues = () => {
    clients.forEach(client => {
      const dueDate = new Date(client.paymentDueDate);
      const today = new Date();
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        toast.warning(`Payment due in ${daysUntilDue} days for ${client.contactName}`);
        showNotification(
          'Payment Due Soon',
          `Payment for ${client.contactName} is due in ${daysUntilDue} days`
        );
      } else if (daysUntilDue <= 0) {
        toast.error(`Payment overdue for ${client.contactName}`);
        showNotification(
          'Payment Overdue',
          `Payment for ${client.contactName} is overdue by ${Math.abs(daysUntilDue)} days`
        );
      }
    });
  };

  // Check payment dues periodically
  useEffect(() => {
    checkPaymentDues();
    const interval = setInterval(checkPaymentDues, 24 * 60 * 60 * 1000); // Check every 24 hours
    
    return () => clearInterval(interval);
  }, [clients, notificationPermission]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/dashboard');
  };

  const handleQuotationOpen = (quotationUrl) => {
    window.open(quotationUrl, '_blank');
  };

  const updateOverdueClients = () => {
    const today = new Date();
    const overdue = clients.filter(client => {
      const dueDate = new Date(client.paymentDueDate);
      return dueDate < today;
    }).sort((a, b) => {
      // Sort by most overdue first
      return new Date(a.paymentDueDate) - new Date(b.paymentDueDate);
    });
    setOverdueClients(overdue);
  };

  // Update overdue clients whenever clients array changes
  useEffect(() => {
    updateOverdueClients();
  }, [clients]);

  return (
    <div className="management-dashboard">
      <div className="dashboard-content">
        <div className="main-content">
          <h1>Client Management</h1>
          
          <button 
            className="add-client-btn"
            onClick={() => {
              if (!showAddForm) {
                setEditingClient(null);
              }
              setShowAddForm(!showAddForm)
            }}
          >
            {showAddForm ? 'Cancel' : 'Add New Client'}
          </button>

          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="add-client-form">
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <div className="form-group" key="contactName">
                <label>Contact Name:</label>
                <input
                  type="text"
                  required
                  value={newClient.contactName}
                  onChange={(e) => setNewClient({...newClient, contactName: e.target.value})}
                />
              </div>

              <div className="form-group" key="phoneNumber">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  required
                  value={newClient.phoneNumber}
                  onChange={(e) => setNewClient({...newClient, phoneNumber: e.target.value})}
                />
              </div>

              <div className="form-group" key="location">
                <label>Location:</label>
                <input
                  type="text"
                  required
                  value={newClient.location}
                  onChange={(e) => setNewClient({...newClient, location: e.target.value})}
                />
              </div>

              <div className="form-group" key="email">
                <label>Email:</label>
                <input
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>

              <div className="form-group" key="subscriptionDate">
                <label>Subscription Date:</label>
                <input
                  type="date"
                  required
                  value={newClient.subscriptionDate}
                  onChange={(e) => setNewClient({...newClient, subscriptionDate: e.target.value})}
                />
              </div>

              <div className="form-group" key="paymentDueDate">
                <label>Payment Due Date:</label>
                <input
                  type="date"
                  required
                  value={newClient.paymentDueDate}
                  onChange={(e) => setNewClient({...newClient, paymentDueDate: e.target.value})}
                />
              </div>

              <div className="form-group" key="quotationFile">
                <label>Quotation File:</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="submit-btn">
                {editingClient ? 'Update Client' : 'Add Client'}
              </button>
            </form>
          )}

          <div className="table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Subscription Date</th>
                  <th>Payment Due Date</th>
                  <th>Quotation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id || client._id}>
                    <td>{client.contactName}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.email}</td>
                    <td>{client.location}</td>
                    <td>{new Date(client.subscriptionDate).toLocaleDateString()}</td>
                    <td>{new Date(client.paymentDueDate).toLocaleDateString()}</td>
                    <td>
                      {client.quotationFile ? (
                        <button
                          className="open-quotation-btn"
                          onClick={() => handleQuotationOpen(client.quotationFile)}
                        >
                          Open PDF
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overdue-sidebar">
          <h2>Overdue Payments</h2>
          {overdueClients.length > 0 ? (
            <div className="overdue-list">
              {overdueClients.map(client => {
                const daysOverdue = Math.ceil(
                  (new Date() - new Date(client.paymentDueDate)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={client.id} className="overdue-item">
                    <h3>{client.contactName}</h3>
                    <p className="overdue-days">
                      {daysOverdue} days overdue
                    </p>
                    <p className="overdue-contact">
                      <span>📞 {client.phoneNumber}</span>
                      <span>📧 {client.email}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-overdue">No overdue payments</p>
          )}
        </div>
      </div>

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 