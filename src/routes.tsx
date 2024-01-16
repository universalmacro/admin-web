import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
import AdminTables from "views/admin/manage";
import NodeTables from "views/admin/nodes";
import Profile from "views/admin/profile";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import { MdBarChart, MdLock, MdPeopleAlt } from "react-icons/md";
import { FaShareNodes } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

const routes = [
  {
    name: "系统管理",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "systems",
    component: <SystemTables />,
  },
  {
    name: "人員管理",
    layout: "/admin",
    icon: <MdPeopleAlt className="h-6 w-6" />,
    path: "manage",
    component: <AdminTables />,
  },
  {
    name: "節點管理",
    layout: "/admin",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "nodes",
    component: <NodeTables />,
  },
  {
    name: "個人資料",
    layout: "/admin",
    icon: <CgProfile className="h-6 w-6" />,
    path: "profile",
    component: <Profile />,
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
