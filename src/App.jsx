import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductEditScreen from "./pages/ProductEditScreen";

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E-Shop
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {userInfo ? (
              <>
                <li className="relative group">
                  <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
                    {userInfo.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </li>
                {userInfo.isAdmin && (
                  <li className="relative" ref={adminRef}>
                    <button
                      onClick={() => setShowAdminMenu((prev) => !prev)}
                      className="text-gray-700 hover:text-blue-600 focus:outline-none"
                    >
                      Admin
                    </button>

                    {showAdminMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                          to="/admin/userlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Users
                        </Link>
                        <Link
                          to="/admin/productlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Products
                        </Link>
                        <Link
                          to="/admin/orderlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                      </div>
                    )}
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route
            path="/admin/product/:id/edit"
            element={<ProductEditScreen />}
          />
          {/* Add more routes here */}
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
