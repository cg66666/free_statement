/*
 * @Description: file content
 * @Author: 朱晨光
 * @Date: 2023-09-16 19:34:11
 * @LastEditors: cg
 * @LastEditTime: 2025-01-02 14:24:21
 */
import { useState, useEffect } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Home from '@/pages/Home';
import Show from '@/pages/Show';
import './App.scss';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={`/${import.meta.env.VITE_PREFIX}/`} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="show" element={<Show />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
