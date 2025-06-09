import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  InputNumber, 
  Input, 
  Button, 
  message, 
  Typography, 
  Space, 
  Divider,
  Alert,
  Spin
} from 'antd';
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  BankOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AccountService, formatCurrency } from '../services/accountService';

const { Title, Text } = Typography;
const { Option } = Select;

// Demo user ID for testing
const DEMO_USER_ID = 'b061f043-07b3-4006-be9f-b75e90631b96';

const TransactionForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionType, setTransactionType] = useState('DEPOSIT');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      
      // Check if backend is healthy
      await AccountService.healthCheck();
      
      // Load accounts for demo user
      const userAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
      setAccounts(userAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      message.error('Failed to load accounts. Please check if the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = async (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    setSelectedAccount(account);
  };

  const handleSubmit = async (values) => {
    if (!selectedAccount) {
      message.error('Please select an account');
      return;
    }

    try {
      setLoading(true);

      const request = {
        amount: values.amount,
        description: values.description || `${transactionType.toLowerCase()} transaction`
      };

      let result;
      if (transactionType === 'DEPOSIT') {
        result = await AccountService.creditAccount(selectedAccount.id, request);
        message.success(`Successfully deposited ${formatCurrency(values.amount)} to account ${selectedAccount.accountNumber}`);
      } else {
        result = await AccountService.debitAccount(selectedAccount.id, request);
        message.success(`Successfully withdrawn ${formatCurrency(values.amount)} from account ${selectedAccount.accountNumber}`);
      }

      // Reset form
      form.resetFields();
      setSelectedAccount(null);
      
      // Navigate back to history
      navigate('/history');
      
    } catch (error) {
      const errorMessage = error.message || `Failed to process ${transactionType.toLowerCase()}`;
      message.error(errorMessage);
      console.error(`Error processing ${transactionType.toLowerCase()}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    form.resetFields(['amount', 'description']);
  };

  if (loading && accounts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading accounts...</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/history')}
        >
          Back to History
        </Button>
      </Space>

      <Card 
        title={
          <Space>
            <DollarOutlined />
            <span>New Transaction</span>
          </Space>
        }
        style={{ maxWidth: 600 }}
      >
        {accounts.length === 0 && !loading && (
          <Alert
            message="No accounts available"
            description="Please create an account first before making transactions."
            type="warning"
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            transactionType: 'DEPOSIT'
          }}
        >
          <Form.Item
            name="transactionType"
            label="Transaction Type"
            rules={[
              { required: true, message: 'Please select transaction type' }
            ]}
          >
            <Select
              size="large"
              onChange={handleTransactionTypeChange}
              value={transactionType}
            >
              <Option value="DEPOSIT">
                <Space>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  Deposit
                </Space>
              </Option>
              <Option value="WITHDRAWAL">
                <Space>
                  <ArrowDownOutlined style={{ color: '#f5222d' }} />
                  Withdrawal
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accountId"
            label="Select Account"
            rules={[
              { required: true, message: 'Please select an account' }
            ]}
          >
            <Select
              size="large"
              placeholder="Choose account for transaction"
              onChange={handleAccountChange}
            >
              {accounts.map(account => (
                <Option key={account.id} value={account.id}>
                  <Space>
                    <BankOutlined />
                    <span>{account.accountNumber}</span>
                    <Text type="secondary">
                      ({formatCurrency(account.balance)})
                    </Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedAccount && (
            <Alert
              message={`Current Balance: ${formatCurrency(selectedAccount.balance)}`}
              type="info"
              style={{ marginBottom: '16px' }}
            />
          )}

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
              ...(transactionType === 'WITHDRAWAL' && selectedAccount ? [{
                validator: (_, value) => {
                  if (value && value > selectedAccount.balance) {
                    return Promise.reject(new Error('Insufficient funds'));
                  }
                  return Promise.resolve();
                }
              }] : [])
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter amount"
              min={0.01}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea
              size="large"
              rows={3}
              placeholder="Enter transaction description..."
              maxLength={200}
            />
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={transactionType === 'DEPOSIT' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                disabled={accounts.length === 0}
              >
                {transactionType === 'DEPOSIT' ? 'Process Deposit' : 'Process Withdrawal'}
              </Button>
              
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setSelectedAccount(null);
                }}
              >
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TransactionForm; 