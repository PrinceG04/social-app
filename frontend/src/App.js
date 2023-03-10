import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import ScrollToTop from "./utils/ScrollToTop";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import './style.scss'
import { DarkModeContext } from "./context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
function App() {
  // const currentUser = true;
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext)

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <NavBar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProctectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    else {
      return children;
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProctectedRoute>
        <ScrollToTop>
          <Layout />
        </ScrollToTop>

      </ProctectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ]);





  return (
    <div>

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
