import { RouterProvider, Outlet ,createBrowserRouter } from "react-router-dom";
import Stock from './Component/Stock.jsx';
import Invoice from './Component/Invoice.jsx';
import Login from './Component/Login.jsx';
import ChangePass from './Component/ChangePass.jsx';

const Layout = () => {
    return (
      <>
        <Outlet />
      </>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // Main layout with Nav
        children: [
            {
                path: "/",
                element: <Login /> // Login as the default route
            },
            {
                path: "/invoice",
                element: <Invoice />
            },
            {
                path: "/stock",
                element: <Stock />
            },
            {
                path: "/profile",
                element: <ChangePass />
            }
        ]
    }
]);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
