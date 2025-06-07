import React, { useState } from 'react';
import { Card, Form, Select, Button, message, Typography, Space, Divider } from 'antd';
import { BankOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AccountService, AccountType, getAccountTypeLabel } from '../services/accountService';

const { Title, Text } = Typography;
const { Option } = Select;

// Demo user ID for testing
const DEMO_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const request = {
        userId: DEMO_USER_ID,
        accountType: values.accountType
      };

      const newAccount = await AccountService.createAccount(request);
      
      message.success(
        `Successfully created ${getAccountTypeLabel(values.accountType)}!`,
        3
      );

      // Navigate back to account list
      navigate('/list');
      
    } catch (error) {
      const errorMessage = error.message || 'Failed to create account';
      message.error(errorMessage);
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/list')}
            >
              Back to Accounts
            </Button>
          </Space>
          
          <Divider />
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <BankOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ margin: '0 0 8px 0' }}>Create New Account</Title>
            <Text type="secondary">
              Choose the type of account you'd like to create
            </Text>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                size="large"
                onClick={() => navigate('/list')}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<BankOutlined />}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAccount; 