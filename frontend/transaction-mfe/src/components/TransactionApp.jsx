import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Typography, Divider } from 'antd';
import TransactionHistory from './TransactionHistory';
import TransactionForm from './TransactionForm';

const { Title, Text } = Typography;

const TransactionApp = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Transaction Management</Title>
        <Text type="secondary">Track deposits, withdrawals and view transaction history</Text>
      </div>
      
      <Divider />
      
      <Routes>
        <Route path="/" element={<TransactionHistory />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/new" element={<TransactionForm />} />
      </Routes>
    </div>
  );
};

export default TransactionApp; 