import React from 'react';
import { Card, Typography, Form, Input, Select, Button, Row, Col } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const CreateAccount: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Create account:', values);
  };

  return (
    <Card>
      <Title level={4}>Create New Account</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Customer Name"
              name="customerName"
              rules={[{ required: true, message: 'Please enter customer name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Account Type"
              name="accountType"
              rules={[{ required: true, message: 'Please select account type' }]}
            >
              <Select placeholder="Select account type">
                <Option value="CHECKING">Checking</Option>
                <Option value="SAVINGS">Savings</Option>
                <Option value="BUSINESS">Business</Option>
                <Option value="JOINT">Joint</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Initial Deposit"
              name="initialDeposit"
              rules={[{ required: true, message: 'Please enter initial deposit' }]}
            >
              <Input type="number" placeholder="0.00" prefix="$" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Currency"
              name="currency"
              initialValue="USD"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAccount; 