import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/config-sidebar";
import Footer from "components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { configRoutes } from "routes";
import { AppDispatch } from "../../store";
import { testRoutes } from "routes";

export default function Config(props: { [x: string]: any }) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("database");
  const dispatch = useDispatch<AppDispatch>();
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const { id: nodeId } = useParams();

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(testRoutes);
  }, [location.pathname]);

  const getActiveRoute = (routesConfig: any): string | boolean => {
    let activeRoute = "database";
    for (let j = 0; j < routesConfig?.length; j++) {
      let routes = routesConfig?.[j].children;
      for (let i = 0; i < routes?.length; i++) {
        if (
          window.location.href.indexOf(
            routes[i].layout + "/" + nodeId + "/config/" + routes[i].path
          ) !== -1
        ) {
          setCurrentRoute(routes[i].name);
        }
      }
    }

    return activeRoute;
  };
  const getActiveNavbar = (routesConfig: any): string | boolean => {
    let activeNavbar = false;
    for (let j = 0; j < routesConfig?.length; j++) {
      let routes = routesConfig?.[j].children;

      for (let i = 0; i < routes?.length; i++) {
        if (
          window.location.href.indexOf(
            routes[i].layout + "/" + nodeId + "/config/" + routes[i].path
          ) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routesConfig: any): any => {
    let routeList = [];
    for (let j = 0; j < routesConfig?.length; j++) {
      let routes = routesConfig?.[j].children;
      routeList.push(
        routes?.map((prop: any, key: any) => {
          if (prop.layout === "/nodes") {
            return <Route path={`${prop.path}`} element={prop.component} key={key} />;
          } else {
            return null;
          }
        })
      );
    }
    return routeList;
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} routeConifg={testRoutes} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[230px]`}>
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              secondary={getActiveNavbar(testRoutes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-4 md:pr-2">
              <Routes>
                {getRoutes(testRoutes)}

                <Route path="/" element={<Navigate to="/admin/nodes" replace />} />
              </Routes>
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
