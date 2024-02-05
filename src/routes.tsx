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
import FrontendDomainConfig from "views/config/frontendDomain";

// Merchants
import MerchantConfig from "views/merchant/account";

// Detailss
import DetailPage from "views/details/detail";

// Icon Imports
import {
  MdBarChart,
  MdLock,
  MdPeopleAlt,
  MdBlurLinear,
  MdOutlineSwitchAccount,
} from "react-icons/md";
import { FaShareNodes, FaDatabase } from "react-icons/fa6";
import { CiServer } from "react-icons/ci";
import { TbApi } from "react-icons/tb";
import { SiRedis } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { BiDetail } from "react-icons/bi";
import Authenticator from "views/authentication/index";

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
    name: "Authentication",
    layout: "/admin",
    path: "auth",
    icon: <MdLock className="h-6 w-6" />,
    component: <Authenticator />,
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
    secondary: false,
  },
  {
    name: "database",
    layout: "/nodes",
    icon: <FaDatabase className="h-6 w-6" />,
    path: "database",
    component: <DatabaseConfig />,
    secondary: true,
  },
  {
    name: "server",
    layout: "/nodes",
    icon: <CiServer className="h-6 w-6" />,
    path: "server",
    component: <ServerConfig />,
    secondary: true,
  },
  {
    name: "redis",
    layout: "/nodes",
    icon: <SiRedis className="h-6 w-6" />,
    path: "redis",
    component: <RedisConfig />,
    secondary: true,
  },
  {
    name: "api",
    layout: "/nodes",
    icon: <TbApi className="h-6 w-6" />,
    path: "api",
    component: <ApiConfig />,
    secondary: true,
  },
  {
    name: "frontendDomain",
    layout: "/nodes",
    icon: <MdBlurLinear className="h-6 w-6" />,
    path: "frontendDomain",
    component: <FrontendDomainConfig />,
    secondary: true,
  },
];

// 節點配置的路由
const merchantsRoutes = [
  {
    name: "返回",
    layout: "/admin",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "nodes",
    component: <NodeTables />,
    secondary: false,
  },
  {
    name: "merchant",
    layout: "/merchant",
    icon: <TbApi className="h-6 w-6" />,
    path: "merchant",
    component: <MerchantConfig />,
    secondary: true,
  },
];

const detailRoute = [
  {
    name: "節點列表",
    layout: "/admin",
    icon: <FaShareNodes className="h-6 w-6" />,
    path: "nodes",
    component: <NodeTables />,
    secondary: false,
  },
  {
    name: "信息",
    layout: "/details",
    icon: <BiDetail className="h-6 w-6" />,
    path: "details",
    component: <DetailPage />,
    secondary: true,
  },
];

const testRoutes: Array<{ name: string; children: RoutesType[] }> = [
  {
    name: "節點配置",
    children: [
      {
        name: "database",
        layout: "/nodes",
        icon: <FaDatabase className="h-6 w-6" />,
        path: "database",
        component: <DatabaseConfig />,
        secondary: true,
      },
      {
        name: "server",
        layout: "/nodes",
        icon: <CiServer className="h-6 w-6" />,
        path: "server",
        component: <ServerConfig />,
        secondary: true,
      },
      {
        name: "redis",
        layout: "/nodes",
        icon: <SiRedis className="h-6 w-6" />,
        path: "redis",
        component: <RedisConfig />,
        secondary: true,
      },
      {
        name: "api",
        layout: "/nodes",
        icon: <TbApi className="h-6 w-6" />,
        path: "api",
        component: <ApiConfig />,
        secondary: true,
      },
      {
        name: "frontendDomain",
        layout: "/nodes",
        icon: <MdBlurLinear className="h-6 w-6" />,
        path: "frontendDomain",
        component: <FrontendDomainConfig />,
        secondary: true,
      },
    ],
  },
  {
    name: "帳號配置",
    children: [
      {
        name: "merchant",
        layout: "/nodes",
        icon: <MdOutlineSwitchAccount className="h-6 w-6" />,
        path: "merchant",
        component: <MerchantConfig />,
        secondary: true,
      },
    ],
  },
];

export default routes;

export { configRoutes, merchantsRoutes, testRoutes, detailRoute };
