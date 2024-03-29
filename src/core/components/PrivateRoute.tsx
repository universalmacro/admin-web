import { useEffect } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userInfoAuth } from "../../features/auth/authActions";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";

import { AppDispatch } from "../../store";

const PrivateRoute = ({ children }: any) => {
  const { userToken, userInfo, error } = useSelector((state: any) => state.auth) || {};
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  console.log("PrivateRouteProps", userToken, userInfo);

  const errorCallback = (e: any) => {
    Modal.error({
      content: `獲取個人信息錯誤：${e}`,
      afterClose: () => {
        localStorage.removeItem("admin-web-token");
        navigate("/auth/sign-in");
      },
    });
  };

  useEffect(() => {
    if (userToken && !userInfo?.id) {
      dispatch(userInfoAuth({ token: userToken }));
    }
  }, [userInfo?.id]);

  useEffect(() => {
    if (error && !userInfo?.id) {
      errorCallback(error);
    }
  }, [error]);

  if (userToken && !error) {
    return children;
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
};

export default PrivateRoute;
