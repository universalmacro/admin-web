/* eslint-disable */
import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  let location = useLocation();
  const { routes } = props;
  const { id } = useParams();

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    let index = location.pathname?.lastIndexOf("/");
    let subRoute = location.pathname?.substring(index + 1, location.pathname.length);
    return routeName.includes(subRoute);
  };

  const createLinks = (routes: RoutesType[]) => {
    return routes?.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl" ||
        route.layout === "/nodes"
      ) {
        return (
          <Link
            key={index}
            to={
              route?.secondary
                ? route.layout + "/" + id + "/config/" + route.path
                : route.layout + "/" + route.path
            }
          >
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li className="my-[3px] flex cursor-pointer items-center px-8" key={index}>
                <span
                  className={`${
                    activeRoute(route.path) === true
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 ml-4 flex ${
                    activeRoute(route.path) === true
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(route.path) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      }
    });
  };
  // BRAND
  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;
