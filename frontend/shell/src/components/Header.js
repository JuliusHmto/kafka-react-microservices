import React, { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Dropdown, Badge, Button, Space, Spin } from 'antd';
import {
  BankOutlined,
  DashboardOutlined,
  AccountBookOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuOutlined,
} from '@ant-design/icons';

// Lazy load notification bell with fallback
const NotificationBell = React.lazy(() =>
  import('notificationMfe/NotificationBell').catch(() => ({
    default: () => (
      <Badge count={0}>
        <BellOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
      </Badge>
    )
  }))
);

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data
  const currentUser = {
    name: 'John Smith',
    email: 'john.smith@securebank.com',
    avatar: null,
    accountNumber: '****5678'
  };

  // Navigation items
  const navItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: '/accounts',
      icon: <AccountBookOutlined />,
      label: 'Accounts',
      path: '/accounts'
    },
    {
      key: '/transactions',
      icon: <HistoryOutlined />,
      label: 'Transactions',
      path: '/transactions'
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      path: '/notifications'
    }
  ];

  // User menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'security',
      icon: <SettingOutlined />,
      label: 'Security',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case 'logout':
        console.log('Logging out...');
        // Implement logout logic
        break;
      case 'profile':
        console.log('Navigate to profile...');
        break;
      case 'security':
        console.log('Navigate to security settings...');
        break;
      default:
        break;
    }
  };

  return (
    <header className="app-header">
      {/* Logo */}
      <div className="app-logo">
        <BankOutlined className="app-logo-icon" />
        <span>SecureBank</span>
      </div>

      {/* Navigation - Desktop */}
      <nav className="app-nav">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`app-nav-item ${
              location.pathname.startsWith(item.key) ? 'active' : ''
            }`}
          >
            <Space>
              {item.icon}
              {item.label}
            </Space>
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="app-user-menu">
        {/* Notifications */}
        <Suspense fallback={
          <Badge count={0}>
            <Spin size="small" />
          </Badge>
        }>
          <NotificationBell />
        </Suspense>

        {/* User Dropdown */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
          arrow
        >
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {currentUser.accountNumber}
              </span>
            </div>
          </div>
        </Dropdown>

        {/* Mobile Menu Toggle */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ 
            display: 'none',
            '@media (maxWidth: 768px)': {
              display: 'flex'
            }
          }}
        />
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: '#fff',
            borderBottom: '1px solid #d9d9d9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 999,
            display: 'none',
            '@media (maxWidth: 768px)': {
              display: 'block'
            }
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                color: '#262626',
                textDecoration: 'none',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Space>
                {item.icon}
                {item.label}
              </Space>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header; 