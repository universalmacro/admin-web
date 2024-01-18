import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
import AdminTables from "views/admin/manage";
import NodeTables from "views/admin/nodes";
import Profile from "views/admin/profile";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Configs Imports
import Database from "views/config/database";

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
    name: "配置",
    layout: "/admin",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "configs",
    component: <NodeTables />,
    hidden: true,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    hidden: true,
    component: <SignIn />,
  },
];

const configRoutes = [
  {
    name: "返回",
    layout: "/admin",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "nodes",
    component: <NodeTables />,
  },
  {
    name: "database",
    layout: "/config",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "database",
    component: <Database />,
  },
  {
    name: "server",
    layout: "/config",
    icon: <MdPeopleAlt className="h-6 w-6" />,
    path: "server",
    component: <AdminTables />,
  },
  {
    name: "redis",
    layout: "/config",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "redis",
    component: <NodeTables />,
  },
];
export default routes;

export { configRoutes };
