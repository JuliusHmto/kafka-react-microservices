import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Tag, 
  Space, 
  Row, 
  Col,
  Statistic,
  Modal,
  Descriptions,
  Typography,
  Empty,
  Spin
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  HomeOutlined,
  TrophyOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: null,
    account: 'all'
  });

  // Mock transaction data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 'TXN-001',
          date: '2024-01-15T10:30:00Z',
          description: 'Amazon Purchase - Electronics',
          amount: -89.95,
          type: 'DEBIT',
          category: 'Shopping',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'AMZ-789456123',
          merchant: 'Amazon.com',
          location: 'Online',
          balance: 12457.94
        },
        {
          id: 'TXN-002',
          date: '2024-01-14T09:00:00Z',
          description: 'Salary Deposit - TechCorp Inc',
          amount: 3500.00,
          type: 'CREDIT',
          category: 'Income',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'SAL-202401-001',
          merchant: 'TechCorp Inc',
          location: 'Direct Deposit',
          balance: 12547.89
        },
        {
          id: 'TXN-003',
          date: '2024-01-13T16:45:00Z',
          description: 'Shell Gas Station',
          amount: -45.20,
          type: 'DEBIT',
          category: 'Transportation',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'SHELL-456789',
          merchant: 'Shell',
          location: 'Main St, Downtown',
          balance: 9047.89
        },
        {
          id: 'TXN-004',
          date: '2024-01-12T08:00:00Z',
          description: 'Mortgage Payment - First National Bank',
          amount: -1850.00,
          type: 'DEBIT',
          category: 'Housing',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'MORT-202401-001',
          merchant: 'First National Bank',
          location: 'Auto Payment',
          balance: 9093.09
        },
        {
          id: 'TXN-005',
          date: '2024-01-11T14:20:00Z',
          description: 'Investment Dividend - Growth Fund',
          amount: 125.75,
          type: 'CREDIT',
          category: 'Investment',
          account: 'ACC-002-9012',
          accountType: 'SAVINGS',
          status: 'COMPLETED',
          reference: 'DIV-GF-001',
          merchant: 'Growth Fund LLC',
          location: 'Investment Account',
          balance: 45766.38
        },
        {
          id: 'TXN-006',
          date: '2024-01-10T12:15:00Z',
          description: 'Grocery Store - Fresh Market',
          amount: -127.83,
          type: 'DEBIT',
          category: 'Shopping',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'FM-789123',
          merchant: 'Fresh Market',
          location: 'Oak Avenue',
          balance: 10943.09
        },
        {
          id: 'TXN-007',
          date: '2024-01-09T19:30:00Z',
          description: 'Netflix Subscription',
          amount: -15.99,
          type: 'DEBIT',
          category: 'Entertainment',
          account: 'ACC-003-3456',
          accountType: 'CREDIT',
          status: 'COMPLETED',
          reference: 'NFLX-SUB-001',
          merchant: 'Netflix Inc',
          location: 'Online',
          balance: -2831.93
        },
        {
          id: 'TXN-008',
          date: '2024-01-08T11:45:00Z',
          description: 'ATM Withdrawal',
          amount: -200.00,
          type: 'DEBIT',
          category: 'Cash',
          account: 'ACC-001-5678',
          accountType: 'CHECKING',
          status: 'COMPLETED',
          reference: 'ATM-789456',
          merchant: 'SecureBank ATM',
          location: 'Downtown Branch',
          balance: 11070.92
        }
      ];
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions based on current filters
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.merchant.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.reference.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(txn => txn.category === filters.category);
    }

    // Account filter
    if (filters.account !== 'all') {
      filtered = filtered.filter(txn => txn.account === filters.account);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(txn => {
        const txnDate = dayjs(txn.date);
        return txnDate.isAfter(start.startOf('day')) && txnDate.isBefore(end.endOf('day'));
      });
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

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
      Investment: <TrophyOutlined />,
      Entertainment: <CreditCardOutlined />,
      Cash: <BankOutlined />
    };
    return iconMap[category] || <BankOutlined />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'PENDING':
        return 'orange';
      case 'FAILED':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      dateRange: null,
      account: 'all'
    });
  };

  const showTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const exportTransactions = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log('Exporting transactions:', filteredTransactions);
    // Mock export functionality
    const csvContent = filteredTransactions.map(txn => 
      `${txn.date},${txn.description},${txn.amount},${txn.type},${txn.category}`
    ).join('\n');
    console.log('CSV Content:', csvContent);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Space>
          {getTransactionIcon(record.category)}
          <div>
            <div style={{ fontWeight: '500' }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.merchant} • {record.reference}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
      filters: [
        { text: 'Shopping', value: 'Shopping' },
        { text: 'Income', value: 'Income' },
        { text: 'Transportation', value: 'Transportation' },
        { text: 'Housing', value: 'Housing' },
        { text: 'Investment', value: 'Investment' },
        { text: 'Entertainment', value: 'Entertainment' },
        { text: 'Cash', value: 'Cash' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      render: (account, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{account}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.accountType}
          </Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontWeight: 'bold', 
            color: amount < 0 ? '#ff4d4f' : '#52c41a',
            fontSize: '16px'
          }}>
            {amount < 0 ? '' : '+'}
            {formatCurrency(amount)}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Balance: {formatCurrency(record.balance)}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => showTransactionDetail(record)}
        >
          Details
        </Button>
      ),
    },
  ];

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(txn => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(txn => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          Transaction History
        </h1>
        <p style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: 0 }}>
          View and manage your transaction history across all accounts
        </p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Income"
              value={totalIncome}
              formatter={(value) => formatCurrency(value)}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={totalExpenses}
              formatter={(value) => formatCurrency(value)}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Net Amount"
              value={netAmount}
              formatter={(value) => formatCurrency(value)}
              prefix={netAmount >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: netAmount >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Input
              placeholder="Search transactions..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Type"
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="all">All Types</Option>
              <Option value="CREDIT">Credit</Option>
              <Option value="DEBIT">Debit</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Category"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="all">All Categories</Option>
              <Option value="Shopping">Shopping</Option>
              <Option value="Income">Income</Option>
              <Option value="Transportation">Transportation</Option>
              <Option value="Housing">Housing</Option>
              <Option value="Investment">Investment</Option>
              <Option value="Entertainment">Entertainment</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button onClick={clearFilters}>Clear</Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={exportTransactions}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Transaction Detail Modal */}
      <Modal
        title="Transaction Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedTransaction && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Transaction ID">
              {selectedTransaction.id}
            </Descriptions.Item>
            <Descriptions.Item label="Date & Time">
              {dayjs(selectedTransaction.date).format('MMMM DD, YYYY at HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedTransaction.description}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <span style={{ 
                fontWeight: 'bold', 
                color: selectedTransaction.amount < 0 ? '#ff4d4f' : '#52c41a',
                fontSize: '18px'
              }}>
                {selectedTransaction.amount < 0 ? '' : '+'}
                {formatCurrency(selectedTransaction.amount)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={selectedTransaction.type === 'CREDIT' ? 'green' : 'red'}>
                {selectedTransaction.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag>{selectedTransaction.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Account">
              {selectedTransaction.account} ({selectedTransaction.accountType})
            </Descriptions.Item>
            <Descriptions.Item label="Merchant">
              {selectedTransaction.merchant}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedTransaction.location}
            </Descriptions.Item>
            <Descriptions.Item label="Reference">
              {selectedTransaction.reference}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedTransaction.status)}>
                {selectedTransaction.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Balance After">
              {formatCurrency(selectedTransaction.balance)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TransactionHistory; 