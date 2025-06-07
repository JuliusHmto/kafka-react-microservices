import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AccountDetail: React.FC = () => {
  const { accountId } = useParams();

  return (
    <Card>
      <Title level={4}>Account Details</Title>
      <p>Showing details for account ID: {accountId}</p>
      <p>This is a placeholder component for account detail view.</p>
    </Card>
  );
};

export default AccountDetail; 