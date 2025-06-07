import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Card, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Avatar
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  BankOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

interface Account {
  id: string;
  accountNumber: string;
  customerName: string;
  accountType: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'CLOSED';
  createdAt: string;
}

const mockAccounts: Account[] = [
  {
    id: '1',
    accountNumber: '1234567890',
    customerName: 'John Doe',
    accountType: 'CHECKING',
    balance: 15750.50,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    accountNumber: '2345678901',
    customerName: 'Jane Smith',
    accountType: 'SAVINGS',
    balance: 45320.75,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    accountNumber: '3456789012',
    customerName: 'Michael Johnson',
    accountType: 'BUSINESS',
    balance: 125000.00,
    currency: 'USD',
    status: 'ACTIVE',
    createdAt: '2024-01-28',
  },
  {
    id: '4',
    accountNumber: '4567890123',
    customerName: 'Sarah Wilson',
    accountType: 'CHECKING',
    balance: 2850.25,
    currency: 'USD',
    status: 'SUSPENDED',
    createdAt: '2024-03-05',
  },
];

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'SUSPENDED': return 'red';
      case 'PENDING': return 'orange';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.includes(searchTerm)
  );

  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = filteredAccounts.filter(account => account.status === 'ACTIVE').length;

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: Account) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
              {record.accountNumber}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type: string) => (
        <Tag icon={<BankOutlined />} color="blue">
          {type}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number, record: Account) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          {record.currency} {balance.toLocaleString()}
        </span>
      ),
      sorter: (a: Account, b: Account) => a.balance - b.balance,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Suspended', value: 'SUSPENDED' },
        { text: 'Pending', value: 'PENDING' },
        { text: 'Closed', value: 'CLOSED' },
      ],
      onFilter: (value: any, record: Account) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Account, b: Account) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Account) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/accounts/${record.id}`)}
          >
            View
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => console.log('Edit account:', record.id)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={filteredAccounts.length}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Accounts"
              value={activeAccounts}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Balance"
              value={totalBalance}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Customer Accounts</Title>
          <Space>
            <Search
              placeholder="Search by name or account number"
              allowClear
              style={{ width: 300 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/accounts/create')}
            >
              Create Account
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
        />
      </Card>
    </div>
  );
};

export default AccountList; 