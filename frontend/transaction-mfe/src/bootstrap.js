import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import TransactionApp from './components/TransactionApp.jsx';
import 'antd/dist/reset.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <div style={{ padding: '24px' }}>
          <TransactionApp />
        </div>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
); 