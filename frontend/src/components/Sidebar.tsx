import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BankOutlined,
  TransactionOutlined,
  BellOutlined,
  BarChartOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/accounts',
    icon: <BankOutlined />,
    label: 'Accounts',
  },
  {
    key: '/transactions',
    icon: <TransactionOutlined />,
    label: 'Transactions',
  },
  {
    key: '/notifications',
    icon: <BellOutlined />,
    label: 'Notifications',
  },
  {
    key: '/analytics',
    icon: <BarChartOutlined />,
    label: 'Analytics',
  },
  {
    key: '/security',
    icon: <SafetyOutlined />,
    label: 'Security',
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/accounts')) return '/accounts';
    if (path.startsWith('/transactions')) return '/transactions';
    if (path.startsWith('/notifications')) return '/notifications';
    if (path.startsWith('/analytics')) return '/analytics';
    if (path.startsWith('/security')) return '/security';
    return '/dashboard';
  };

  return (
    <Sider
      width={250}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          height: '100%',
          borderRight: 0,
          paddingTop: '16px',
        }}
      />
    </Sider>
  );
};

export default Sidebar; 