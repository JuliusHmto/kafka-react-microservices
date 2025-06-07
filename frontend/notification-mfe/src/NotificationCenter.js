import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Select, 
  Input, 
  DatePicker, 
  Switch, 
  Statistic, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Typography, 
  Alert, 
  Divider,
  Tooltip,
  message
} from 'antd';
import {
  BellOutlined,
  FilterOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  SoundOutlined,
  DesktopOutlined,
  SecurityScanOutlined,
  BankOutlined,
  GiftOutlined,
  ToolOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import NotificationService from './services/NotificationService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    severity: 'all',
    read: 'all',
    dateRange: null
  });
  const [settings, setSettings] = useState({
    browserNotifications: true,
    soundNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    notificationTypes: {
      transaction: true,
      security: true,
      account: true,
      promotional: false,
      system: true
    }
  });

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = NotificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Initial load
    setNotifications(NotificationService.getNotifications());
    
    // Request browser notification permission
    NotificationService.requestPermission();

    return unsubscribe;
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = NotificationService.filterNotifications(filters);
    setFilteredNotifications(filtered);
  }, [filters, notifications]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'info':
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'transaction':
        return <BankOutlined style={{ color: '#52c41a' }} />;
      case 'security':
        return <SecurityScanOutlined style={{ color: '#ff4d4f' }} />;
      case 'account':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'promotional':
        return <GiftOutlined style={{ color: '#722ed1' }} />;
      case 'system':
        return <ToolOutlined style={{ color: '#faad14' }} />;
      default:
        return <BellOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'red';
      case 'warning': return 'orange';
      case 'success': return 'green';
      case 'info': 
      default: return 'blue';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'transaction': return 'green';
      case 'security': return 'red';
      case 'account': return 'blue';
      case 'promotional': return 'purple';
      case 'system': return 'orange';
      default: return 'default';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBulkAction = (action) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select notifications first');
      return;
    }

    switch (action) {
      case 'markRead':
        selectedRowKeys.forEach(id => NotificationService.markAsRead(id));
        message.success(`Marked ${selectedRowKeys.length} notifications as read`);
        break;
      case 'delete':
        selectedRowKeys.forEach(id => NotificationService.deleteNotification(id));
        message.success(`Deleted ${selectedRowKeys.length} notifications`);
        break;
    }
    setSelectedRowKeys([]);
  };

  const handleTestNotification = () => {
    NotificationService.addNotification({
      type: 'system',
      severity: 'info',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      timestamp: new Date(),
      read: false,
      actionable: false
    });
    message.success('Test notification sent!');
  };

  const handleConnectionTest = () => {
    NotificationService.simulateConnectionIssue();
    message.info('Simulating connection issue...');
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)}>
          {getTypeIcon(type)}
        </Tooltip>
      ),
      filters: [
        { text: 'Transaction', value: 'transaction' },
        { text: 'Security', value: 'security' },
        { text: 'Account', value: 'account' },
        { text: 'Promotional', value: 'promotional' },
        { text: 'System', value: 'system' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Notification',
      key: 'notification',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            {getSeverityIcon(record.severity)}
            <Text 
              strong={!record.read} 
              style={{ marginLeft: '8px', fontSize: '14px' }}
            >
              {record.title}
            </Text>
            {!record.read && (
              <Tag color="blue" size="small" style={{ marginLeft: '8px' }}>
                NEW
              </Tag>
            )}
          </div>
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '13px',
              color: record.read ? '#8c8c8c' : '#595959'
            }}
          >
            {record.message}
          </Text>
          {record.actionable && (
            <div style={{ marginTop: '4px' }}>
              <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                Take Action
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'type',
      key: 'category',
      width: 120,
      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>
          {severity.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp) => dayjs(timestamp).format('MMM DD, HH:mm'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Status',
      dataIndex: 'read',
      key: 'status',
      width: 80,
      render: (read) => (
        <Tag color={read ? 'default' : 'processing'}>
          {read ? 'READ' : 'UNREAD'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          {!record.read && (
            <Tooltip title="Mark as read">
              <Button 
                type="text" 
                size="small"
                icon={<CheckOutlined />}
                onClick={() => NotificationService.markAsRead(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button 
              type="text" 
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => NotificationService.deleteNotification(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  // Statistics
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.severity === 'error').length;
  const todayCount = notifications.filter(n => 
    dayjs(n.timestamp).isAfter(dayjs().startOf('day'))
  ).length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <BellOutlined style={{ marginRight: '12px' }} />
              Notification Center
            </Title>
            <Text type="secondary">
              Manage your banking notifications and preferences
            </Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleTestNotification}
              >
                Test Notification
              </Button>
              <Button 
                icon={<SettingOutlined />} 
                onClick={() => setSettingsVisible(true)}
              >
                Settings
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Notifications"
              value={totalNotifications}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Unread"
              value={unreadCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: unreadCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Critical Alerts"
              value={criticalCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: criticalCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Today"
              value={todayCount}
              prefix={<InfoCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Connection Status */}
      <Alert
        message={
          <Space>
            <span>Real-time Notifications</span>
            <Tag color={NotificationService.isConnected() ? 'green' : 'red'}>
              {NotificationService.isConnected() ? 'CONNECTED' : 'DISCONNECTED'}
            </Tag>
            {!NotificationService.isConnected() && (
              <Button 
                type="link" 
                size="small" 
                onClick={handleConnectionTest}
              >
                Test Connection
              </Button>
            )}
          </Space>
        }
        type={NotificationService.isConnected() ? 'success' : 'warning'}
        style={{ marginBottom: '24px' }}
        showIcon
      />

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Input
              placeholder="Search notifications..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
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
              <Option value="transaction">Transaction</Option>
              <Option value="security">Security</Option>
              <Option value="account">Account</Option>
              <Option value="promotional">Promotional</Option>
              <Option value="system">System</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Severity"
              value={filters.severity}
              onChange={(value) => handleFilterChange('severity', value)}
            >
              <Option value="all">All Severity</Option>
              <Option value="info">Info</Option>
              <Option value="success">Success</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              value={filters.read}
              onChange={(value) => handleFilterChange('read', value)}
            >
              <Option value="all">All Status</Option>
              <Option value={false}>Unread</Option>
              <Option value={true}>Read</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#f6ffed' }}>
          <Space>
            <Text strong>{selectedRowKeys.length} selected</Text>
            <Button 
              type="primary" 
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleBulkAction('markRead')}
            >
              Mark as Read
            </Button>
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </Space>
        </Card>
      )}

      {/* Notifications Table */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredNotifications}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} notifications`,
          }}
          scroll={{ x: 1000 }}
          rowClassName={(record) => 
            record.read ? '' : 'notification-unread'
          }
        />
      </Card>

      {/* Settings Modal */}
      <Modal
        title="Notification Settings"
        open={settingsVisible}
        onCancel={() => setSettingsVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setSettingsVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary"
            onClick={() => {
              message.success('Settings saved successfully!');
              setSettingsVisible(false);
            }}
          >
            Save Settings
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <Title level={4}>Notification Channels</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <DesktopOutlined />
                  <span>Browser Notifications</span>
                </Space>
              </Col>
              <Col>
                <Switch 
                  checked={settings.browserNotifications}
                  onChange={(checked) => 
                    setSettings(prev => ({...prev, browserNotifications: checked}))
                  }
                />
              </Col>
            </Row>
            
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <SoundOutlined />
                  <span>Sound Notifications</span>
                </Space>
              </Col>
              <Col>
                <Switch 
                  checked={settings.soundNotifications}
                  onChange={(checked) => 
                    setSettings(prev => ({...prev, soundNotifications: checked}))
                  }
                />
              </Col>
            </Row>
          </Space>

          <Divider />

          <Title level={4}>Notification Types</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
              <Row key={type} justify="space-between" align="middle">
                <Col>
                  <Space>
                    {getTypeIcon(type)}
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </Space>
                </Col>
                <Col>
                  <Switch 
                    checked={enabled}
                    onChange={(checked) => 
                      setSettings(prev => ({
                        ...prev, 
                        notificationTypes: {
                          ...prev.notificationTypes,
                          [type]: checked
                        }
                      }))
                    }
                  />
                </Col>
              </Row>
            ))}
          </Space>
        </div>
      </Modal>

      <style jsx>{`
        .notification-unread {
          background-color: #f6ffed !important;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter; 