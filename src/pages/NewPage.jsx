import React from 'react';
import { Helmet } from 'react-helmet';

export default function NewPage() {
  return (
    <>
      <Helmet>
        <meta httpEquiv="refresh" content="0;url=https://nextgem.kimai.cloud/en/timesheet/" />
      </Helmet>
      <div className="new-page">
        <div>Redirecting...</div>
      </div>
    </>
  );
} 