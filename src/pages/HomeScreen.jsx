import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to E-Shop!
      </h1>
      {userInfo ? (
        <div className="mt-6">
          <p className="text-xl text-gray-600">Hello, {userInfo.name}!</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          {userInfo.isAdmin && (
            <p className="mt-2 text-green-600 font-semibold">
              You are an Admin!
            </p>
            // Add a link to the admin panel here later
          )}
        </div>
      ) : (
        <p className="text-xl text-gray-600">
          Please login or register to continue shopping.
        </p>
      )}
    </div>
  );
};

export default HomeScreen;
