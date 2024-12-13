/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-10-23 17:21:01
 * @LastEditors: cg
 * @LastEditTime: 2024-11-14 15:32:07
 */
// Layout.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ConfigProvider, Image, Modal, message, Spin } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';

const Layout = () => {
  return (
    <ConfigProvider
      locale={zh_CN}
      // input={{ autoComplete: "off" }}
      // renderEmpty={customizeRenderEmpty}
    >
      <Outlet></Outlet>
    </ConfigProvider>
  );
};

export default Layout;
