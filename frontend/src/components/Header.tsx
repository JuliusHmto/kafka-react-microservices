import React from 'react';
import { Layout, Typography, Avatar, Dropdown, Badge, Space } from 'antd';
import { 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BankOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
];

const Header: React.FC = () => {
  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'logout':
        console.log('Logout clicked');
        break;
      default:
        break;
    }
  };

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BankOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
        <Text strong style={{ fontSize: '20px', color: '#262626' }}>
          Banking System
        </Text>
      </div>

      <Space size="large">
        <Badge count={3} size="small">
          <BellOutlined 
            style={{ 
              fontSize: '18px', 
              color: '#595959',
              cursor: 'pointer'
            }} 
          />
        </Badge>
        
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <Text style={{ color: '#595959' }}>John Doe</Text>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header; 