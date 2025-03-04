import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ManagementDashboard.css';
import { useNavigate } from 'react-router-dom';
import EditClientModal from '../Components/EditClientModal';

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
  const [paymentDueMonthDay, setPaymentDueMonthDay] = useState({ month: '', day: '' });
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.MODE === 'development';
  // Set this to false to use the API instead of mock data
  const USE_MOCK_DATA = true; // Temporarily use mock data until backend is running
  
  // Set the base URL for the API based on the environment
  const FIREBASE_EMULATOR_URL = 'http://localhost:5001/nextgem-website-backend/us-central1/api';
  const FIREBASE_PRODUCTION_URL = 'https://us-central1-nextgem-website-backend.cloudfunctions.net/api';
  
  const BACKEND_URL = isDevelopment 
    ? FIREBASE_EMULATOR_URL
    : FIREBASE_PRODUCTION_URL;
    
  // Helper function to get the correct API URL for each environment
  const getApiUrl = (endpoint) => {
    // Remove any leading slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    // For Firebase Functions, we need to concatenate the API path
    // The api prefix is already in the BACKEND_URL so we don't need to include it again
    // For endpoints like 'api/clients', we need to just use 'clients'
    const apiPath = cleanEndpoint.startsWith('api/') ? cleanEndpoint.substring(4) : cleanEndpoint;
    
    return `${BACKEND_URL}/${apiPath}`;
  };

  // Debug log to check the URL and environment
  console.log('Environment:', import.meta.env.MODE);
  console.log('Backend URL:', BACKEND_URL);
  console.log('Sample API endpoint:', getApiUrl('api/clients'));
  console.log('Using mock data:', USE_MOCK_DATA);

  // Load mock data from localStorage if available
  useEffect(() => {
    if (USE_MOCK_DATA) {
      const savedClients = localStorage.getItem('mockClients');
      if (savedClients) {
        try {
          const parsedClients = JSON.parse(savedClients);
          console.log('Loaded mock clients from localStorage:', parsedClients);
          setClients(parsedClients);
        } catch (error) {
          console.error('Error parsing saved clients:', error);
        }
      }
    }
  }, [USE_MOCK_DATA]);

  // Save mock data to localStorage when it changes
  useEffect(() => {
    if (USE_MOCK_DATA && clients.length > 0) {
      console.log('Saving clients to localStorage:', clients);
      localStorage.setItem('mockClients', JSON.stringify(clients));
    }
  }, [clients, USE_MOCK_DATA]);

  // Fetch clients on component mount
  useEffect(() => {
    // Only fetch from API if we're not using mock data
    if (!USE_MOCK_DATA) {
      fetchClients();
    }
    
    // Always check payment dues
    checkPaymentDues();
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
          console.log("This browser does not support notifications");
          return;
        }
        
        // Check if we already have permission
        if (Notification.permission === "granted") {
          setNotificationPermission(true);
          return;
        }
        
        // Request permission
        if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission === "granted");
          
          if (permission === "granted") {
            // Send a test notification
            new Notification("Notifications Enabled", {
              body: "You will now receive payment due notifications",
              icon: "/favicon.ico"
            });
          }
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestNotificationPermission();
  }, []);

  const fetchClients = async () => {
    // If we were previously using mock data, the flag has been changed
    if (USE_MOCK_DATA) {
      console.log('Using mock data instead of fetching from API');
      const mockData = [
        {
          id: '1',
          contactName: 'John Doe',
          phoneNumber: '123-456-7890',
          location: 'New York',
          email: 'john@example.com',
          subscriptionDate: new Date('2023-01-01').toISOString(),
          paymentDueDate: new Date('2023-06-15').toISOString(),
          quotationFile: null,
          paymentHistory: []
        },
        {
          id: '2',
          contactName: 'Jane Smith',
          phoneNumber: '987-654-3210',
          location: 'Los Angeles',
          email: 'jane@example.com',
          subscriptionDate: new Date('2023-02-15').toISOString(),
          paymentDueDate: new Date('2023-07-10').toISOString(),
          quotationFile: null,
          paymentHistory: []
        }
      ];
      
      setClients(mockData);
      return;
    }

    console.log('Fetching clients from API');
    console.log('API endpoint:', getApiUrl('api/clients'));
    
    try {
      const response = await fetch(getApiUrl('api/clients'));
      
      if (!response.ok) {
        // Log more details about the error
        const statusText = response.statusText;
        console.error('Response status:', response.status, statusText);
        
        try {
          const errorText = await response.text();
          console.log('Raw error response:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: `Server error (${response.status}): ${statusText || 'Unknown error'}` };
          }
          throw new Error(errorData.error || 'Failed to fetch clients');
        } catch (e) {
          throw new Error(`Error parsing response: ${e.message}`);
        }
      }
      
      const data = await response.json();
      console.log('Clients fetched successfully:', data);
      setClients(data);
      updateOverdueClients();
      
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients: ' + error.message);
      
      // Fallback to mock data in case of API failure
      // This ensures the application remains functional
      toast.warning('Using mock data as fallback due to API error');
      const mockData = [
        {
          id: '1',
          contactName: 'John Doe',
          phoneNumber: '123-456-7890',
          location: 'New York',
          email: 'john@example.com',
          subscriptionDate: new Date('2023-01-01').toISOString(),
          paymentDueDate: new Date('2023-06-15').toISOString(),
          quotationFile: null,
          paymentHistory: []
        },
        {
          id: '2',
          contactName: 'Jane Smith',
          phoneNumber: '987-654-3210',
          location: 'Los Angeles',
          email: 'jane@example.com',
          subscriptionDate: new Date('2023-02-15').toISOString(),
          paymentDueDate: new Date('2023-07-10').toISOString(),
          quotationFile: null,
          paymentHistory: []
        }
      ];
      
      setClients(mockData);
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
    
    // Validate form fields
    if (!newClient.contactName || !newClient.phoneNumber || 
        !newClient.location || 
        !newClient.subscriptionDate || 
        !paymentDueMonthDay.month || !paymentDueMonthDay.day) {
      
      toast.error('Please fill in all required fields');
      console.log('Form validation failed:', {
        client: newClient,
        paymentDueMonthDay
      });
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
    
    // Create an object with the client data
    const clientData = {
      contactName: newClient.contactName,
      phoneNumber: newClient.phoneNumber,
      location: newClient.location,
      email: newClient.email || '',
      subscriptionDate: newClient.subscriptionDate,
      paymentDueDate: paymentDueDate.toISOString()
    };
    
    // Use mock data if the flag is set
    if (USE_MOCK_DATA) {
      console.log('Using mock data instead of API');
      
      // Create a new client with the data
      const newMockClient = {
        id: Date.now().toString(),
        ...clientData,
        quotationFile: newClient.quotationFile,
        paymentHistory: []
      };
      
      console.log('Adding new mock client:', newMockClient);
      
      // Update the clients state with the new client
      setClients(prevClients => {
        const updatedClients = [...prevClients, newMockClient];
        console.log('Updated clients list:', updatedClients);
        return updatedClients;
      });
      
      toast.success('Client added successfully (mock)');
      setShowAddForm(false);
      
      // Reset form
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
      setPaymentDueMonthDay({ month: '', day: '' });
      
      // Force an update of the overdue clients list
      setTimeout(() => {
        updateOverdueClients();
        checkPaymentDues();
      }, 100);
      
      return;
    }

    try {
      console.log('Sending client data to API:', clientData);
      console.log('API endpoint:', getApiUrl('api/clients'));
      
      const response = await fetch(getApiUrl('api/clients'), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      });

      let errorData;
      if (!response.ok) {
        // Log more details about the error
        const statusText = response.statusText;
        console.error('Response status:', response.status, statusText);
        
        try {
          const errorText = await response.text();
          console.log('Raw error response:', errorText);
          
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: `Server error (${response.status}): ${statusText || 'Unknown error'}` };
          }
          throw new Error(errorData.error || 'Failed to add client');
        } catch (e) {
          throw new Error(`Error parsing response: ${e.message}`);
        }
      }

      const result = await response.json();
      console.log('API response:', result);
      
      toast.success('Client added successfully');
      setShowAddForm(false);
      // Reset form
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
      setPaymentDueMonthDay({ month: '', day: '' });
      
      // Fetch the updated list of clients
      fetchClients();
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
    console.log('handleUpdate called with:', updatedClient);
    
    // Validate the updatedClient data
    if (!updatedClient.contactName || !updatedClient.phoneNumber || 
        !updatedClient.location || 
        !updatedClient.subscriptionDate || !updatedClient.paymentDueDate) {
      
      toast.error('Invalid client data. Please check all fields.');
      console.error('Invalid client data:', updatedClient);
      return;
    }
    
    // Use mock data if the flag is set
    if (USE_MOCK_DATA) {
      console.log('Using mock data instead of updating via API');
      
      // Simulate updating a client in the mock data
      setClients(prevClients => {
        const updatedClients = prevClients.map(client => 
          (client.id === updatedClient.id || client._id === updatedClient._id) 
            ? updatedClient 
            : client
        );
        console.log('Updated client list:', updatedClients);
        return updatedClients;
      });
      
      toast.success('Client updated successfully (mock)');
      setEditingClient(null);
      
      // Force an update of the overdue clients list
      setTimeout(() => {
        updateOverdueClients();
        checkPaymentDues();
      }, 100);
      
      return;
    }
    
    try {
      console.log('Updating client via API:', updatedClient);
      const endpoint = getApiUrl('api/clients/' + (updatedClient.id || updatedClient._id));
      console.log('API endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedClient)
      });

      if (!response.ok) {
        // Log more details about the error
        const statusText = response.statusText;
        console.error('Response status:', response.status, statusText);
        
        try {
          const errorText = await response.text();
          console.log('Raw error response:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: `Server error (${response.status}): ${statusText || 'Unknown error'}` };
          }
          throw new Error(errorData.error || 'Failed to update client');
        } catch (e) {
          throw new Error(`Error parsing response: ${e.message}`);
        }
      }

      const result = await response.json();
      console.log('API response:', result);
      
      toast.success('Client updated successfully');
      setEditingClient(null);
      
      // Fetch the updated list of clients
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error(error.message || 'Failed to update client');
    }
  };

  const showNotification = (title, body) => {
    console.log('Attempting to show notification:', { title, body });
    
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }
    
    if (notificationPermission) {
      try {
        console.log('Permission granted, creating notification');
        new Notification(title, {
          body,
          icon: "/favicon.ico", // Use your website favicon
        });
        console.log('Notification created successfully');
      } catch (error) {
        console.error("Error showing notification:", error);
      }
    } else {
      console.log('Notification permission not granted, showing toast only');
    }
  };

  const checkPaymentDues = () => {
    console.log('Running checkPaymentDues with clients:', clients);
    
    if (clients.length === 0) {
      console.log('No clients to check for payment dues');
      return;
    }
    
    clients.forEach(client => {
      console.log('Checking payment due for client:', client.contactName);
      
      if (!client.paymentDueDate) {
        console.log('Client has no payment due date:', client.contactName);
        return;
      }
      
      const dueDate = new Date(client.paymentDueDate);
      console.log('Original payment due date:', dueDate);
      
      if (isNaN(dueDate.getTime())) {
        console.error('Invalid payment due date for client:', client.contactName, client.paymentDueDate);
        return;
      }
      
      const today = new Date();
      console.log('Today:', today);
      
      // Get the current month's occurrence of the payment due date
      const currentMonthDueDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        dueDate.getDate()
      );
      
      console.log('Current month due date (before adjustment):', currentMonthDueDate);
      
      // If the date is invalid (e.g., trying to set Feb 30), it rolls over to next month
      // Adjust back to the last day of the current month
      if (currentMonthDueDate.getMonth() !== today.getMonth()) {
        console.log('Date rolled over to next month, adjusting to last day of current month');
        currentMonthDueDate.setDate(0); // Set to last day of previous month
      }
      
      console.log('Current month due date (after adjustment):', currentMonthDueDate);
      
      // Get the next month's occurrence of the payment due date
      const nextMonthDueDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        dueDate.getDate()
      );
      
      console.log('Next month due date (before adjustment):', nextMonthDueDate);
      
      // If the date is invalid, adjust to last day of the month
      if (nextMonthDueDate.getMonth() !== (today.getMonth() + 1) % 12) {
        console.log('Next month date invalid, adjusting to last day of month');
        nextMonthDueDate.setDate(0); // Set to last day of previous month
      }
      
      console.log('Next month due date (after adjustment):', nextMonthDueDate);
      
      // Determine which due date to use (current month or next month)
      let nextDueDate;
      if (currentMonthDueDate < today) {
        // Current month's due date has passed, use next month
        nextDueDate = nextMonthDueDate;
        console.log('Current month due date has passed, using next month:', nextDueDate);
      } else {
        // Current month's due date is still in the future
        nextDueDate = currentMonthDueDate;
        console.log('Current month due date is in the future, using it:', nextDueDate);
      }
      
      const timeDiff = nextDueDate.getTime() - today.getTime();
      const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
      console.log('Days until due:', daysUntilDue);

      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        console.log('Payment due soon, showing notification');
        toast.warning(`Payment due in ${daysUntilDue} days for ${client.contactName}`);
        showNotification(
          'Payment Due Soon',
          `Payment for ${client.contactName} is due in ${daysUntilDue} days (on ${nextDueDate.toLocaleDateString()})`
        );
      } else if (daysUntilDue <= 0) {
        // Calculate actual days overdue based on the current month's due date
        const daysOverdue = Math.ceil((today.getTime() - currentMonthDueDate.getTime()) / (1000 * 3600 * 24));
        console.log('Payment overdue, showing notification. Days overdue:', daysOverdue);
        
        toast.error(`Payment overdue for ${client.contactName} by ${daysOverdue} days`);
        showNotification(
          'Payment Overdue',
          `Payment for ${client.contactName} is overdue by ${daysOverdue} days (was due ${currentMonthDueDate.toLocaleDateString()})`
        );
      } else {
        console.log('Payment not due soon and not overdue');
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
    navigate('/login');
  };

  const handleQuotationOpen = (quotationUrl) => {
    window.open(quotationUrl, '_blank');
  };

  const updateOverdueClients = () => {
    const today = new Date();
    const overdue = clients.filter(client => {
      const dueDate = new Date(client.paymentDueDate);
      // Get current month's due date
      const currentMonthDueDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        dueDate.getDate()
      );
      
      // Handle invalid dates (like Feb 30) by adjusting to the last day of the month
      if (currentMonthDueDate.getMonth() !== today.getMonth()) {
        currentMonthDueDate.setDate(0); // Set to last day of previous month
      }
      
      return currentMonthDueDate < today;
    }).sort((a, b) => {
      // Sort by most days overdue - this gives a better sorting for the overdue list
      const dueA = new Date(a.paymentDueDate);
      const dueB = new Date(b.paymentDueDate);
      
      // Calculate days overdue for A
      const dueDateA = new Date(
        today.getFullYear(),
        today.getMonth(),
        dueA.getDate()
      );
      if (dueDateA.getMonth() !== today.getMonth()) {
        dueDateA.setDate(0);
      }
      const daysOverdueA = Math.ceil((today - dueDateA) / (1000 * 60 * 60 * 24));
      
      // Calculate days overdue for B
      const dueDateB = new Date(
        today.getFullYear(),
        today.getMonth(),
        dueB.getDate()
      );
      if (dueDateB.getMonth() !== today.getMonth()) {
        dueDateB.setDate(0);
      }
      const daysOverdueB = Math.ceil((today - dueDateB) / (1000 * 60 * 60 * 24));
      
      // Sort by most overdue (higher days overdue) first
      return daysOverdueB - daysOverdueA;
    });
    
    setOverdueClients(overdue);
  };

  // Update overdue clients whenever clients array changes
  useEffect(() => {
    updateOverdueClients();
  }, [clients]);

  const resetMockDatesForTesting = () => {
    if (!clients.length) {
      toast.error('No clients to update');
      return;
    }
    
    // Create test dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Update client dates for testing notifications
    const updatedClients = clients.map((client, index) => {
      if (index % 2 === 0) {
        // Even clients - set to yesterday (overdue)
        return {
          ...client,
          paymentDueDate: yesterday.toISOString()
        };
      } else {
        // Odd clients - set to 3 days from now (due soon)
        return {
          ...client,
          paymentDueDate: threeDaysFromNow.toISOString()
        };
      }
    });
    
    setClients(updatedClients);
    localStorage.setItem('mockClients', JSON.stringify(updatedClients));
    toast.success('Updated client dates for testing');
    
    // Run payment dues check
    setTimeout(() => {
      checkPaymentDues();
    }, 500);
  };

  return (
    <div className="management-dashboard">
      <nav className="dashboard-nav">
        <h1>NextGem Dashboard</h1>
        <div>
          <button className="debug-btn" onClick={checkPaymentDues}>
            Check Payment Dues
          </button>
          {USE_MOCK_DATA && (
            <button className="debug-btn" onClick={resetMockDatesForTesting}>
              Reset Mock Dates
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
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
                        
                        // Provide visual feedback
                        if (parseInt(day) > 28 && paymentDueMonthDay.month === '02') {
                          toast.warning('February may not have this many days in some years');
                        }
                      }}
                    />
                  </div>
                </div>
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
                const dueDate = new Date(client.paymentDueDate);
                const today = new Date();
                
                // Get current month's due date
                const currentMonthDueDate = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  dueDate.getDate()
                );
                
                // Handle invalid dates by adjusting to the last day of the month
                if (currentMonthDueDate.getMonth() !== today.getMonth()) {
                  currentMonthDueDate.setDate(0);
                }
                
                const daysOverdue = Math.ceil(
                  (today - currentMonthDueDate) / (1000 * 60 * 60 * 24)
                );
                
                // Calculate next due date
                const nextMonthDueDate = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  dueDate.getDate()
                );
                
                // Handle invalid dates by adjusting to the last day of the month
                if (nextMonthDueDate.getMonth() !== (today.getMonth() + 1) % 12) {
                  nextMonthDueDate.setDate(0);
                }
                
                return (
                  <div key={client.id || client._id} className="overdue-item">
                    <h3>{client.contactName}</h3>
                    <p className="overdue-days">
                      {daysOverdue} days overdue
                    </p>
                    <p className="next-payment">
                      Next payment: {nextMonthDueDate.toLocaleDateString()}
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