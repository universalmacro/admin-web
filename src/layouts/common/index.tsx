import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { nodeRoutes } from "routes";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";

const { Header, Content, Sider, Footer } = Layout;

const items3: MenuProps["items"] = nodeRoutes.map((item, index) => {
  return {
    key: item.key,
    // icon: React.createElement(item.icon),
    icon: item.icon,
    label: item.name,

    children: item?.children?.map((_, j) => {
      const subKey = _.name;
      return {
        key: subKey,
        label: _.name,
      };
    }),
  };
});

export default function Config(props: { [x: string]: any }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("database");
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const { id: nodeId } = useParams();

  const onClickMenu = (route: any) => {
    // if (route.layout == "nodes") {
    navigate("/nodes/" + nodeId + "/config/" + route.key);
    // } else {
    //   navigate("/nodes/" + nodeId + "/" + route.key);
    // }
  };

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(nodeRoutes);
  }, [location.pathname]);

  const getActiveRoute = (routesConfig: any): string => {
    let activeRoute = "database";
    for (let j = 0; j < routesConfig?.length; j++) {
      if (routesConfig?.[j]?.component) {
        console.log(
          "=================================",
          window.location.href,
          "/" + nodeId + "/config/" + routesConfig?.[j].path
        );
        if (
          window.location.href.indexOf("/" + nodeId + "/config/" + routesConfig?.[j].path) !== -1
        ) {
          setCurrentRoute(routesConfig?.[j].key);
        }
      } else {
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
    }

    return activeRoute;
  };

  const getRoutes = (routesConfig: any): any => {
    let routeList = [];
    for (let j = 0; j < routesConfig?.length; j++) {
      if (routesConfig?.[j]?.component) {
        routeList.push(
          <Route
            path={`${routesConfig?.[j].path}`}
            element={routesConfig?.[j].component}
            key={routesConfig?.[j].key}
          />
        );
      } else {
      }
      let routes = routesConfig?.[j].children;
      routeList.push(
        routes?.map((prop: any, key: any) => {
          // if (prop.layout === "/nodes") {
          return <Route path={`${prop.path}`} element={prop.component} key={key} />;
          // } else {
          //   return null;
          // }
        })
      );
    }
    return routeList;
  };

  document.documentElement.dir = "ltr";
  return (
    <>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
          }}
        >
          <div className="flex justify-center p-5">
            <img
              onClick={() => navigate("/")}
              alt="巨集科技"
              src={
                collapsed
                  ? "https://static-1318552943.cos.ap-singapore.myqcloud.com/macro/ui/LOGO2.png"
                  : "https://static-1318552943.cos.ap-singapore.myqcloud.com/macro/ui/LOGO.png"
              }
              className={collapsed ? "h-[20px] cursor-pointer" : "h-[40px] cursor-pointer"}
            />
          </div>

          <Menu
            theme="dark"
            mode="inline"
            // defaultSelectedKeys={[currentRoute]}
            selectedKeys={[currentRoute]}
            defaultOpenKeys={["config", "account"]}
            style={{ borderRight: 0 }}
            items={items3}
            onClick={onClickMenu}
          />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Breadcrumb style={{ margin: "16px" }}>
            <Breadcrumb.Item href="/admin/nodes">配置</Breadcrumb.Item>
            <Breadcrumb.Item>{currentRoute}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              {getRoutes(nodeRoutes)}

              <Route path="/" element={<Navigate to="/admin/nodes" replace />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Universal Macro ©{new Date().getFullYear()}
          </Footer>
        </Layout>
        {/* </div> */}
        {/* </main> */}
        {/* </div> */}
      </Layout>

      {/* </div> */}
    </>
  );
}
