import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
import AdminTables from "views/admin/manage";
import NodeTables from "views/admin/nodes";
import Profile from "views/admin/profile";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Configs Imports
import DatabaseConfig from "views/config/database";
import ServerConfig from "views/config/server";
import RedisConfig from "views/config/redis";
import ApiConfig from "views/config/api";

// Icon Imports
import { MdBarChart, MdLock, MdPeopleAlt } from "react-icons/md";
import { FaShareNodes, FaDatabase, FaServer } from "react-icons/fa6";
import { TbApi } from "react-icons/tb";
import { SiRedis } from "react-icons/si";
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

// 節點配置的路由
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
    icon: <FaDatabase className="h-6 w-6" />,
    path: "database",
    component: <DatabaseConfig />,
  },
  {
    name: "server",
    layout: "/config",
    icon: <FaServer className="h-6 w-6" />,
    path: "server",
    component: <ServerConfig />,
  },
  {
    name: "redis",
    layout: "/config",
    icon: <SiRedis className="h-6 w-6" />,
    path: "redis",
    component: <RedisConfig />,
  },
  {
    name: "api",
    layout: "/config",
    icon: <TbApi className="h-6 w-6" />,
    path: "api",
    component: <ApiConfig />,
  },
];
export default routes;

export { configRoutes };
