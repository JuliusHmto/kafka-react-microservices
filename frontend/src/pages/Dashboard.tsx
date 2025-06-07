import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import {
  BankOutlined,
  TransactionOutlined,
  UserOutlined,
  SafetyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div className="fade-in">
      <Title level={2} style={{ marginBottom: '24px' }}>
        Banking Dashboard
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={1128}
              prefix={<BankOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Transactions"
              value={342}
              prefix={<TransactionOutlined style={{ color: '#52c41a' }} />}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={956}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Security Alerts"
              value={3}
              prefix={<SafetyOutlined style={{ color: '#ff4d4f' }} />}
              suffix={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Transactions" 
            style={{ height: '400px' }}
            extra={<a href="/transactions">View All</a>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {[
                { id: 1, type: 'Credit', amount: '$2,500', account: '****1234', time: '10:30 AM' },
                { id: 2, type: 'Debit', amount: '$450', account: '****5678', time: '09:15 AM' },
                { id: 3, type: 'Transfer', amount: '$1,200', account: '****9012', time: '08:45 AM' },
                { id: 4, type: 'Credit', amount: '$890', account: '****3456', time: '08:20 AM' },
              ].map((transaction) => (
                <div 
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{transaction.type}</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      {transaction.account} • {transaction.time}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: transaction.type === 'Credit' ? '#52c41a' : '#ff4d4f'
                  }}>
                    {transaction.type === 'Credit' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="System Status" 
            style={{ height: '400px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {[
                { service: 'Account Service', status: 'Healthy', uptime: '99.9%' },
                { service: 'Transaction Service', status: 'Healthy', uptime: '99.8%' },
                { service: 'Notification Service', status: 'Healthy', uptime: '99.7%' },
                { service: 'Fraud Detection', status: 'Warning', uptime: '98.5%' },
                { service: 'API Gateway', status: 'Healthy', uptime: '99.9%' },
              ].map((service, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{service.service}</div>
                    <div style={{ 
                      color: service.status === 'Healthy' ? '#52c41a' : '#faad14',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {service.status}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {service.uptime}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      Uptime
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 