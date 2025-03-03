import React from 'react';
import { Helmet } from 'react-helmet';

export default function ManagementPage() {
  return (
    <>
      <Helmet>
        <meta httpEquiv="refresh" content="0;url=https://nextgem.kimai.cloud/en/timesheet/" />
      </Helmet>
      <div className="management-page">
        <div>Redirecting to management portal...</div>
      </div>
    </>
  );
} 