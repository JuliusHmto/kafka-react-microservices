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
  Tabs,
  Spin,
  Typography
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
  UnlockOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  AccountService, 
  AccountType, 
  AccountStatus,
  formatCurrency, 
  getAccountTypeLabel, 
  getAccountStatusLabel, 
  getAccountStatusColor 
} from './services/accountService';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Demo user ID for testing
const DEMO_USER_ID = 'b061f043-07b3-4006-be9f-b75e90631b96';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionType, setTransactionType] = useState('DEPOSIT');
  const [form] = Form.useForm();
  const [transactionForm] = Form.useForm();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if backend is healthy
      await AccountService.healthCheck();
      
      // Load accounts for demo user
      const userAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
      setAccounts(userAccounts);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load accounts';
      setError(errorMessage);
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case AccountType.CHECKING:
        return <BankOutlined />;
      case AccountType.SAVINGS:
        return <DollarOutlined />;
      case AccountType.BUSINESS:
        return <CreditCardOutlined />;
      default:
        return <BankOutlined />;
    }
  };

  const handleCreateAccount = async (values) => {
    setLoading(true);
    try {
      const request = {
        userId: DEMO_USER_ID,
        accountType: values.accountType
      };

      const newAccount = await AccountService.createAccount(request);
      
      // Refresh the accounts list
      await loadAccounts();
      
      message.success(
        `Successfully created ${getAccountTypeLabel(values.accountType)}!`,
        3
      );
      
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = error.message || 'Failed to create account';
      message.error(errorMessage);
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (values) => {
    if (!selectedAccount) return;
    
    setLoading(true);
    try {
      const request = {
        amount: values.amount,
        description: values.description || `${transactionType.toLowerCase()} transaction`
      };

      let updatedAccount;
      if (transactionType === 'DEPOSIT') {
        updatedAccount = await AccountService.creditAccount(selectedAccount.id, request);
      } else {
        updatedAccount = await AccountService.debitAccount(selectedAccount.id, request);
      }

      // Update the account in the list
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccount.id 
          ? { ...acc, balance: updatedAccount.balance }
          : acc
      ));

      message.success(
        `${transactionType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} completed successfully!`
      );
      
      setTransactionModalVisible(false);
      transactionForm.resetFields();
      setSelectedAccount(null);
    } catch (error) {
      const errorMessage = error.message || `Failed to process ${transactionType.toLowerCase()}`;
      message.error(errorMessage);
      console.error('Error processing transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const openTransactionModal = (account, type) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setTransactionModalVisible(true);
    transactionForm.resetFields();
  };

  const getAccountSummary = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const activeAccounts = accounts.filter(acc => acc.status === AccountStatus.ACTIVE).length;
    const totalAccounts = accounts.length;

    return {
      totalBalance,
      activeAccounts,
      totalAccounts
    };
  };

  const columns = [
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (accountNumber) => (
        <Text strong style={{ fontFamily: 'monospace' }}>
          {accountNumber}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type) => (
        <Space>
          {getAccountTypeIcon(type)}
          <Tag color="blue">{getAccountTypeLabel(type)}</Tag>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getAccountStatusColor(status)}>
          {getAccountStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance, record) => (
        <Text strong style={{ color: balance >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatCurrency(balance, record.currency)}
        </Text>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
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
            disabled={record.status !== AccountStatus.ACTIVE}
          >
            Deposit
          </Button>
          <Button 
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => openTransactionModal(record, 'WITHDRAWAL')}
            disabled={record.status !== AccountStatus.ACTIVE || record.balance <= 0}
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

  if (loading && accounts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading account management...</Text>
        </div>
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Failed to Load Account Management"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={loadAccounts}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const summary = getAccountSummary();

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="banking-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: '0 0 8px 0' }}>Account Management</Title>
            <Text type="secondary">Manage your banking accounts and transactions</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadAccounts}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              Create Account
            </Button>
          </Space>
        </div>
      </div>

      {/* Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card className="slide-in-right">
            <Statistic
              title="Total Balance"
              value={summary.totalBalance}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: summary.totalBalance >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="slide-in-right" style={{ animationDelay: '0.1s' }}>
            <Statistic
              title="Active Accounts"
              value={summary.activeAccounts}
              prefix={<BankOutlined />}
              suffix={`/ ${summary.totalAccounts}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="slide-in-right" style={{ animationDelay: '0.2s' }}>
            <Statistic
              title="Total Accounts"
              value={summary.totalAccounts}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Accounts Table */}
      <Card>
        <Title level={4} style={{ marginBottom: '16px' }}>Your Accounts</Title>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
        />
      </Card>

      {/* Create Account Modal */}
      <Modal
        title="Create New Account"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAccount}
          initialValues={{
            accountType: AccountType.CHECKING
          }}
        >
          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[
              { required: true, message: 'Please select an account type' }
            ]}
          >
            <Select
              size="large"
              placeholder="Select account type"
            >
              <Option value={AccountType.CHECKING}>
                {getAccountTypeLabel(AccountType.CHECKING)}
              </Option>
              <Option value={AccountType.SAVINGS}>
                {getAccountTypeLabel(AccountType.SAVINGS)}
              </Option>
              <Option value={AccountType.BUSINESS}>
                {getAccountTypeLabel(AccountType.BUSINESS)}
              </Option>
              <Option value={AccountType.STUDENT}>
                {getAccountTypeLabel(AccountType.STUDENT)}
              </Option>
              <Option value={AccountType.JOINT}>
                {getAccountTypeLabel(AccountType.JOINT)}
              </Option>
              <Option value={AccountType.PREMIUM}>
                {getAccountTypeLabel(AccountType.PREMIUM)}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => {
                  setCreateModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={<BankOutlined />}
              >
                Create Account
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Transaction Modal */}
      <Modal
        title={`${transactionType === 'DEPOSIT' ? 'Deposit Money' : 'Withdraw Money'}`}
        open={transactionModalVisible}
        onCancel={() => {
          setTransactionModalVisible(false);
          transactionForm.resetFields();
          setSelectedAccount(null);
        }}
        footer={null}
        width={500}
      >
        {selectedAccount && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
            <Text strong>Account: </Text>
            <Text style={{ fontFamily: 'monospace' }}>{selectedAccount.accountNumber}</Text>
            <br />
            <Text strong>Current Balance: </Text>
            <Text style={{ color: selectedAccount.balance >= 0 ? '#52c41a' : '#f5222d' }}>
              {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
            </Text>
          </div>
        )}

        <Form
          form={transactionForm}
          layout="vertical"
          onFinish={handleTransaction}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
              ...(transactionType === 'WITHDRAWAL' && selectedAccount ? [
                { 
                  validator: (_, value) => {
                    if (value && value > selectedAccount.balance) {
                      return Promise.reject(new Error('Insufficient funds'));
                    }
                    return Promise.resolve();
                  }
                }
              ] : [])
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              placeholder="0.00"
              precision={2}
              min={0.01}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea
              rows={3}
              placeholder={`Enter description for this ${transactionType.toLowerCase()}...`}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => {
                  setTransactionModalVisible(false);
                  transactionForm.resetFields();
                  setSelectedAccount(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={transactionType === 'DEPOSIT' ? <UploadOutlined /> : <DownloadOutlined />}
              >
                {transactionType === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
