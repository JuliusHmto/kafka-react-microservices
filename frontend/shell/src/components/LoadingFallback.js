import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingFallback = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner fade-in">
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        size="large"
      />
      <span className="loading-text">{message}</span>
    </div>
  );
};

export default LoadingFallback; 