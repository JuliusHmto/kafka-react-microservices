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
  Spin,
  Alert
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
  CreditCardOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { 
  TransactionService, 
  formatCurrency, 
  getTransactionTypeLabel, 
  getTransactionStatusLabel, 
  getTransactionStatusColor 
} from '../services/transactionService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// Demo user ID for testing
const DEMO_USER_ID = 'b061f043-07b3-4006-be9f-b75e90631b96';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: null,
    account: 'all'
  });

  // Load transaction data from backend
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TransactionService.getUserTransactions(DEMO_USER_ID, page, size);
      
      // Transform backend response to match UI expectations
      const transformedTransactions = response.content.map(txn => ({
        id: txn.id,
        date: txn.createdAt,
        description: txn.description,
        amount: txn.type === 'WITHDRAWAL' ? -txn.amount : txn.amount,
        type: txn.type,
        category: getCategoryFromType(txn.type),
        account: txn.sourceAccountId,
        accountType: 'CHECKING', // Default for now
        status: txn.status,
        reference: txn.reference,
        merchant: 'N/A', // Not available from backend
        location: 'N/A', // Not available from backend
        balance: 0 // Not available in transaction records
      }));
      
      setTransactions(transformedTransactions);
      setFilteredTransactions(transformedTransactions);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements
      });
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromType = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'Income';
      case 'WITHDRAWAL': return 'Cash';
      case 'TRANSFER': return 'Transfer';
      case 'PAYMENT': return 'Shopping';
      default: return 'Other';
    }
  };

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

    // Date range filter
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(txn => {
        const txnDate = dayjs(txn.date);
        return txnDate.isAfter(startDate.startOf('day')) && 
               txnDate.isBefore(endDate.endOf('day'));
      });
    }

    // Account filter
    if (filters.account !== 'all') {
      filtered = filtered.filter(txn => txn.account === filters.account);
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);



  const getTransactionIcon = (category) => {
    switch (category) {
      case 'Shopping': return <ShoppingCartOutlined />;
      case 'Transportation': return <CarOutlined />;
      case 'Housing': return <HomeOutlined />;
      case 'Investment': return <TrophyOutlined />;
      case 'Income': return <BankOutlined />;
      case 'Cash': return <CreditCardOutlined />;
      default: return <BankOutlined />;
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
        <Tag color={getTransactionStatusColor(status)}>
          {getTransactionStatusLabel(status)}
        </Tag>
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
            Transaction History
          </h1>
          <p style={{ color: '#8c8c8c', fontSize: '16px', marginBottom: 0 }}>
            View and manage your transaction history across all accounts
          </p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/new')}
        >
          New Transaction
        </Button>
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

      {/* Error Display */}
      {error && (
        <Alert
          message="Error Loading Transactions"
          description={error}
          type="error"
          style={{ marginBottom: '24px' }}
          showIcon
          action={
            <Button size="small" onClick={() => loadTransactions()}>
              Retry
            </Button>
          }
        />
      )}

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} transactions`,
            onChange: (page, pageSize) => {
              loadTransactions(page - 1, pageSize);
            },
            onShowSizeChange: (current, size) => {
              loadTransactions(0, size);
            }
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