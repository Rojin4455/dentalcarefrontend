import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const access_token = useSelector((state) => state.user.accessToken);
  const is_admin = useSelector((state) => state.user.isAdmin);

  useEffect(() => {
    if (!access_token) {
      navigate("/admin");
    } else if (!is_admin) {
      navigate("/not-authorized");
    }
  }, [access_token, is_admin, navigate]);

  if (!access_token || !is_admin) return null;

  return children;
};

export default AdminProtectedRoute;
