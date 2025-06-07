import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Typography, Divider } from 'antd';
import AccountList from './components/AccountList';
import AccountDetail from './components/AccountDetail';
import CreateAccount from './components/CreateAccount';

const { Title, Text } = Typography;

const AccountApp: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Account Management</Title>
        <Text type="secondary">Manage customer accounts, view balances, and process transactions</Text>
      </div>
      
      <Divider />
      
      <Routes>
        <Route path="/" element={<AccountList />} />
        <Route path="/list" element={<AccountList />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/:accountId" element={<AccountDetail />} />
      </Routes>
    </div>
  );
};

export default AccountApp; 