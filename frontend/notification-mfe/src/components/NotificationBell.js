import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Avatar, Button, Typography, Space, Divider } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import NotificationService from '../services/NotificationService';

dayjs.extend(relativeTime);

const { Text } = Typography;

const NotificationBell = ({ size = 'default', placement = 'bottomRight' }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = NotificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(NotificationService.getUnreadCount());
    });

    // Initial load
    setNotifications(NotificationService.getNotifications());
    setUnreadCount(NotificationService.getUnreadCount());

    return unsubscribe;
  }, []);

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

  const getTypeColor = (type) => {
    switch (type) {
      case 'transaction':
        return '#52c41a';
      case 'security':
        return '#ff4d4f';
      case 'account':
        return '#1890ff';
      case 'promotional':
        return '#722ed1';
      case 'system':
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      NotificationService.markAsRead(notification.id);
    }
    
    // Handle actionable notifications
    if (notification.actionable) {
      handleNotificationAction(notification);
    }
  };

  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case 'transaction':
        console.log('Navigate to transaction details:', notification.metadata);
        break;
      case 'security':
        console.log('Open security settings:', notification.metadata);
        break;
      case 'account':
        console.log('Navigate to account:', notification.metadata);
        break;
      default:
        console.log('Handle notification action:', notification);
    }
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
    setDropdownOpen(false);
  };

  const recentNotifications = notifications.slice(0, 5);

  const dropdownContent = (
    <div style={{ width: 350, maxHeight: 400, overflow: 'auto' }}>
      {/* Header */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong>Notifications</Text>
        <Space>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              icon={<CheckOutlined />}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
          <Button 
            type="link" 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => console.log('Open notification settings')}
          />
        </Space>
      </div>

      {/* Notifications List */}
      {recentNotifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={recentNotifications}
          renderItem={(notification) => (
            <List.Item
              style={{ 
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: notification.read ? 'transparent' : '#f6ffed',
                borderLeft: `4px solid ${getTypeColor(notification.type)}`
              }}
              onClick={() => handleNotificationClick(notification)}
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    NotificationService.deleteNotification(notification.id);
                  }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    size="small" 
                    icon={getSeverityIcon(notification.severity)}
                    style={{ backgroundColor: 'transparent' }}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong={!notification.read} style={{ fontSize: '14px' }}>
                      {notification.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dayjs(notification.timestamp).fromNow()}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <Text 
                      style={{ 
                        fontSize: '13px', 
                        color: notification.read ? '#8c8c8c' : '#262626'
                      }}
                    >
                      {notification.message}
                    </Text>
                    {notification.actionable && (
                      <div style={{ marginTop: '4px' }}>
                        <Text 
                          type="secondary" 
                          style={{ fontSize: '12px', fontStyle: 'italic' }}
                        >
                          Click to take action
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center',
          color: '#8c8c8c'
        }}>
          <BellOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div>No notifications</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            You're all caught up!
          </Text>
        </div>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div style={{ 
            padding: '12px 16px', 
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <Space>
              <Button type="link" size="small">
                View All ({notifications.length})
              </Button>
              <Button 
                type="link" 
                size="small" 
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={['click']}
      placement={placement}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      overlayStyle={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{ cursor: 'pointer', position: 'relative' }}>
        <Badge 
          count={unreadCount} 
          size={size === 'large' ? 'default' : 'small'}
          offset={[0, 0]}
          style={{ backgroundColor: '#ff4d4f' }}
        >
          <BellOutlined 
            style={{ 
              fontSize: size === 'large' ? '24px' : '18px',
              color: unreadCount > 0 ? '#1890ff' : '#8c8c8c',
              transition: 'color 0.3s ease'
            }} 
          />
        </Badge>
        
        {/* Pulse animation for new notifications */}
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ff4d4f',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}
          />
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationBell; 