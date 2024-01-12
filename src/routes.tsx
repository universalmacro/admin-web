import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdBarChart,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "系统管理",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "order-management",
    component: <SystemTables />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
