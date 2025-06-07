import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  message, 
  Statistic, 
  Tag, 
  Space,
  Divider,
  Alert,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
  DownloadOutlined,
  UploadOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [form] = Form.useForm();
  const [transactionForm] = Form.useForm();

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccounts([
        {
          id: 1,
          accountNumber: 'ACC-001-5678',
          accountType: 'CHECKING',
          balance: 12547.89,
          status: 'ACTIVE',
          openDate: '2023-01-15',
          interestRate: 0.5,
          minimumBalance: 100,
          currency: 'USD'
        },
        {
          id: 2,
          accountNumber: 'ACC-002-9012',
          accountType: 'SAVINGS',
          balance: 45892.13,
          status: 'ACTIVE',
          openDate: '2023-02-20',
          interestRate: 2.5,
          minimumBalance: 500,
          currency: 'USD'
        },
        {
          id: 3,
          accountNumber: 'ACC-003-3456',
          accountType: 'CREDIT',
          balance: -2847.92,
          status: 'ACTIVE',
          openDate: '2023-03-10',
          interestRate: 18.9,
          creditLimit: 15000,
          currency: 'USD'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'CHECKING':
        return <BankOutlined />;
      case 'SAVINGS':
        return <DollarOutlined />;
      case 'CREDIT':
        return <CreditCardOutlined />;
      default:
        return <BankOutlined />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'SUSPENDED':
        return 'orange';
      default:
        return 'default';
    }
  };

  const handleCreateAccount = async (values) => {
    setLoading(true);
    try {
      // Simulate API call to backend
      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountType: values.accountType,
          initialDeposit: values.initialDeposit || 0,
          currency: values.currency || 'USD'
        }),
      });

      if (response.ok) {
        const newAccount = await response.json();
        setAccounts([...accounts, {
          id: newAccount.id,
          accountNumber: newAccount.accountNumber,
          accountType: newAccount.accountType,
          balance: newAccount.balance,
          status: newAccount.status,
          openDate: new Date().toISOString().split('T')[0],
          interestRate: values.accountType === 'SAVINGS' ? 2.5 : 0.5,
          minimumBalance: values.accountType === 'SAVINGS' ? 500 : 100,
          currency: newAccount.currency
        }]);
        message.success('Account created successfully!');
        setCreateModalVisible(false);
        form.resetFields();
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      // Fallback to mock creation for demo
      const newAccount = {
        id: accounts.length + 1,
        accountNumber: `ACC-00${accounts.length + 1}-${Math.floor(Math.random() * 9999)}`,
        accountType: values.accountType,
        balance: values.initialDeposit || 0,
        status: 'ACTIVE',
        openDate: new Date().toISOString().split('T')[0],
        interestRate: values.accountType === 'SAVINGS' ? 2.5 : 0.5,
        minimumBalance: values.accountType === 'SAVINGS' ? 500 : 100,
        currency: values.currency || 'USD'
      };
      setAccounts([...accounts, newAccount]);
      message.success('Account created successfully! (Demo Mode)');
      setCreateModalVisible(false);
      form.resetFields();
    }
    setLoading(false);
  };

  const handleTransaction = async (values) => {
    setLoading(true);
    try {
      const endpoint = values.type === 'DEPOSIT' ? 'deposit' : 'withdraw';
      const response = await fetch(`http://localhost:8080/api/accounts/${selectedAccount.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: values.amount,
          description: values.description
        }),
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        setAccounts(accounts.map(acc => 
          acc.id === selectedAccount.id 
            ? { ...acc, balance: updatedAccount.balance }
            : acc
        ));
        message.success(`${values.type.toLowerCase()} completed successfully!`);
        setTransactionModalVisible(false);
        transactionForm.resetFields();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      // Fallback to mock transaction for demo
      const amount = values.type === 'DEPOSIT' ? values.amount : -values.amount;
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccount.id 
          ? { ...acc, balance: acc.balance + amount }
          : acc
      ));
      message.success(`${values.type.toLowerCase()} completed successfully! (Demo Mode)`);
      setTransactionModalVisible(false);
      transactionForm.resetFields();
    }
    setLoading(false);
  };

  const openTransactionModal = (account, type) => {
    setSelectedAccount(account);
    transactionForm.setFieldsValue({ type });
    setTransactionModalVisible(true);
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (text, record) => (
        <Space>
          {getAccountTypeIcon(record.accountType)}
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {record.accountType}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance, record) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            color: balance < 0 ? '#ff4d4f' : '#52c41a',
            fontSize: '16px'
          }}>
            {formatCurrency(balance)}
          </div>
          {record.creditLimit && (
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Limit: {formatCurrency(record.creditLimit)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate) => `${rate}%`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<UploadOutlined />}
            onClick={() => openTransactionModal(record, 'DEPOSIT')}
          >
            Deposit
          </Button>
          <Button 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => openTransactionModal(record, 'WITHDRAW')}
          >
            Withdraw
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const totalBalance = accounts.reduce((sum, account) => {
    return account.accountType !== 'CREDIT' ? sum + account.balance : sum;
  }, 0);

  const totalCredit = accounts
    .filter(account => account.accountType === 'CREDIT')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          Account Management
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: 0 }}>
          Manage your banking accounts, balances, and transactions
        </p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Balance"
              value={totalBalance}
              formatter={(value) => formatCurrency(value)}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={accounts.filter(acc => acc.status === 'ACTIVE').length}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Credit Used"
              value={totalCredit}
              formatter={(value) => formatCurrency(value)}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        title="Your Accounts"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Create Account
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create Account Modal */}
      <Modal
        title="Create New Account"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAccount}
        >
          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[{ required: true, message: 'Please select account type' }]}
          >
            <Select placeholder="Select account type">
              <Option value="CHECKING">Checking Account</Option>
              <Option value="SAVINGS">Savings Account</Option>
              <Option value="CREDIT">Credit Account</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="initialDeposit"
            label="Initial Deposit"
            rules={[{ required: true, message: 'Please enter initial deposit' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter initial deposit amount"
            />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            initialValue="USD"
          >
            <Select>
              <Option value="USD">USD - US Dollar</Option>
              <Option value="EUR">EUR - Euro</Option>
              <Option value="GBP">GBP - British Pound</Option>
            </Select>
          </Form.Item>

          <Alert
            message="Account Creation"
            description="Your new account will be activated immediately upon creation. Minimum balance requirements apply."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCreateModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Account
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Transaction Modal */}
      <Modal
        title={`${transactionForm.getFieldValue('type')} - ${selectedAccount?.accountNumber}`}
        open={transactionModalVisible}
        onCancel={() => setTransactionModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={transactionForm}
          layout="vertical"
          onFinish={handleTransaction}
        >
          <Form.Item name="type" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Alert
            message={`Current Balance: ${selectedAccount ? formatCurrency(selectedAccount.balance) : '$0.00'}`}
            type="info"
            style={{ marginBottom: '16px' }}
          />

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0.01}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter amount"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter transaction description"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setTransactionModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Process Transaction
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement; 