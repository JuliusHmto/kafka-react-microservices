import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, List, Avatar, Tag, Progress, Space } from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  BankOutlined,
  TrophyOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  HomeOutlined,
  SendOutlined,
  DownloadOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data - in real app, this would come from API
  const accountData = {
    checking: {
      balance: 12547.89,
      accountNumber: '****5678',
      change: 234.50,
      changePercent: 1.9
    },
    savings: {
      balance: 45892.13,
      accountNumber: '****9012',
      change: 1205.75,
      changePercent: 2.7
    },
    credit: {
      balance: 2847.92,
      limit: 15000,
      accountNumber: '****3456',
      utilization: 19
    }
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'debit',
      description: 'Amazon Purchase',
      amount: -89.95,
      date: '2024-01-15',
      category: 'Shopping',
      icon: <ShoppingCartOutlined />
    },
    {
      id: 2,
      type: 'credit',
      description: 'Salary Deposit',
      amount: 3500.00,
      date: '2024-01-14',
      category: 'Income',
      icon: <BankOutlined />
    },
    {
      id: 3,
      type: 'debit',
      description: 'Gas Station',
      amount: -45.20,
      date: '2024-01-13',
      category: 'Transportation',
      icon: <CarOutlined />
    },
    {
      id: 4,
      type: 'debit',
      description: 'Mortgage Payment',
      amount: -1850.00,
      date: '2024-01-12',
      category: 'Housing',
      icon: <HomeOutlined />
    },
    {
      id: 5,
      type: 'credit',
      description: 'Investment Dividend',
      amount: 125.75,
      date: '2024-01-11',
      category: 'Investment',
      icon: <TrophyOutlined />
    }
  ];

  const quickActions = [
    {
      title: 'Transfer Money',
      icon: <SendOutlined />,
      description: 'Send money to another account',
      color: '#1890ff'
    },
    {
      title: 'Pay Bills',
      icon: <CreditCardOutlined />,
      description: 'Pay your monthly bills',
      color: '#52c41a'
    },
    {
      title: 'Deposit Check',
      icon: <DownloadOutlined />,
      description: 'Mobile check deposit',
      color: '#faad14'
    },
    {
      title: 'Open Account',
      icon: <PlusOutlined />,
      description: 'Open a new account',
      color: '#722ed1'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTransactionIcon = (category) => {
    const iconMap = {
      Shopping: <ShoppingCartOutlined />,
      Income: <BankOutlined />,
      Transportation: <CarOutlined />,
      Housing: <HomeOutlined />,
      Investment: <TrophyOutlined />
    };
    return iconMap[category] || <DollarOutlined />;
  };

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="banking-card" style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: '600' }}>
          Welcome back, John! 👋
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: 0 }}>
          Here's what's happening with your accounts today.
        </p>
      </div>

      {/* Account Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="slide-in-right" style={{ height: '100%' }}>
            <Statistic
              title="Checking Account"
              value={accountData.checking.balance}
              formatter={(value) => formatCurrency(value)}
              prefix={<BankOutlined />}
              suffix={
                <Tag color={accountData.checking.change > 0 ? 'green' : 'red'}>
                  {accountData.checking.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(accountData.checking.changePercent)}%
                </Tag>
              }
            />
            <p style={{ color: '#8c8c8c', marginTop: '8px', marginBottom: 0 }}>
              Account {accountData.checking.accountNumber}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="slide-in-right" style={{ height: '100%', animationDelay: '0.1s' }}>
            <Statistic
              title="Savings Account"
              value={accountData.savings.balance}
              formatter={(value) => formatCurrency(value)}
              prefix={<TrophyOutlined />}
              suffix={
                <Tag color="green">
                  <ArrowUpOutlined />
                  {accountData.savings.changePercent}%
                </Tag>
              }
            />
            <p style={{ color: '#8c8c8c', marginTop: '8px', marginBottom: 0 }}>
              Account {accountData.savings.accountNumber}
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}>
          <Card className="slide-in-right" style={{ height: '100%', animationDelay: '0.2s' }}>
            <Statistic
              title="Credit Card"
              value={accountData.credit.balance}
              formatter={(value) => formatCurrency(value)}
              prefix={<CreditCardOutlined />}
            />
            <Progress 
              percent={accountData.credit.utilization} 
              status={accountData.credit.utilization > 30 ? 'exception' : 'normal'}
              format={() => `${accountData.credit.utilization}% used`}
              style={{ marginTop: '8px' }}
            />
            <p style={{ color: '#8c8c8c', marginTop: '8px', marginBottom: 0 }}>
              Limit {formatCurrency(accountData.credit.limit)}
            </p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card 
            title="Quick Actions" 
            className="banking-card"
            style={{ height: 'fit-content' }}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={12} key={index}>
                  <Card
                    hoverable
                    size="small"
                    style={{ 
                      textAlign: 'center',
                      borderColor: action.color,
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '16px 8px' }}
                  >
                    <div style={{ color: action.color, fontSize: '24px', marginBottom: '8px' }}>
                      {action.icon}
                    </div>
                    <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {action.title}
                    </h4>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#8c8c8c', 
                      marginBottom: 0,
                      lineHeight: '1.4'
                    }}>
                      {action.description}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Transactions" 
            className="banking-card"
            extra={
              <Button 
                type="link" 
                icon={<EyeOutlined />}
                href="/transactions"
              >
                View All
              </Button>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={recentTransactions}
              loading={loading}
              renderItem={(transaction, index) => (
                <List.Item
                  className="transaction-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="transaction-info">
                    <div className={`transaction-icon ${transaction.type}`}>
                      {getTransactionIcon(transaction.category)}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.description}</h4>
                      <p>{transaction.date} • {transaction.category}</p>
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 