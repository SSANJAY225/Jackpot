import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NotAuth from './Component/NotAuth'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Invoice from './Component/Invoice'
import { useNavigate } from 'react-router-dom';
import Login from './Component/Login'
import Stock from './Component/Stock'
import ChangePass from './Component/ChangePass'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} ></Route>
        <Route path="/invoice" element={<Invoice />} ></Route>
        <Route path="/stock" element={<Stock />} ></Route>
        <Route path="/profile" element={<ChangePass />} ></Route>
        <Route path="/notauth" element={<NotAuth />} ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App