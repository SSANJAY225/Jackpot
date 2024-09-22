import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Stock from './Component/Stock'
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Invoice from './Component/Invoice'
import { useNavigate } from 'react-router-dom';
import Login from './Component/Login'
import ChangePass from './Component/ChangePass'

const Log=()=>{
    return (
        <>
      <Outlet/>
    </>
  )
}

const router=createBrowserRouter([
  {
    path: "/",
    // element:<Login/>,
    children:[
      {
        path:"/",
        element:<Login/>
      },{
        path:"/invoice",
        element:<Invoice/>
      },{
        path:"/stock",
        element:<Stock/>
      },{
        path:"/profile",
        element:<ChangePass/>
      }
    ]
  },
]);

const App=()=>{
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
