import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import Invoice from './Component/Invoice'
import { useNavigate } from 'react-router-dom';
import Login from './Component/Login'
import Stock from './Component/Stock'

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
      }
    ]
  },
]);

const App=()=>{
  return (
    <RouterProvider router={router} />
  )
}

export default App