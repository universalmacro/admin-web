import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/merchants-sidebar";
import Footer from "components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { merchantsRoutes } from "routes";
import { AppDispatch } from "../../store";
import { getNodeInfoConfig } from "../../features/node/nodeActions";
import { setNode } from "features/node/nodeSlice";
import axios from "axios";
import { basePath } from "../../api";

export default function Config(props: { [x: string]: any }) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("database");
  const dispatch = useDispatch<AppDispatch>();
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const { nodeInfo } = useSelector((state: any) => state.node) || {};
  const nodeId = localStorage.getItem("admin-web-nodeId") || "";

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(merchantsRoutes);
  }, [location.pathname]);

  const getNodeInfo = async (id: string) => {
    try {
      const res = await axios.get(`${basePath}/nodes/${id}`, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res) {
        dispatch(setNode(res?.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (nodeId && !nodeInfo) {
      getNodeInfo(nodeId);
    }
  }, [nodeId]);

  React.useEffect(() => {
    console.log("==========configlayout", nodeInfo);
    if (nodeInfo?.id) {
      // dispatch(setNode(location?.state?.info));
      dispatch(getNodeInfoConfig({ id: nodeInfo.id, token: userToken }));
    }
  }, [nodeInfo?.id]);

  const getActiveRoute = (routes: RoutesType[]): string | boolean => {
    let activeRoute = "merchant";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + "/" + nodeId + "/" + routes[i].path) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((prop, key) => {
      if (prop.layout === "/merchant") {
        return <Route path={`${prop.path}`} element={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[230px]`}>
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              secondary={getActiveNavbar(merchantsRoutes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>{getRoutes(merchantsRoutes)}</Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
