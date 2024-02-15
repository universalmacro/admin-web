/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import { Link, useParams } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { BiDetail } from "react-icons/bi";

const Sidebar = (props: {
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
  routeConifg: any;
}) => {
  const { open, onClose, routeConifg } = props;
  const { id } = useParams();

  return (
    <>
      <div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
          open ? "translate-x-0" : "-translate-x-96"
        }`}
      >
        <span className="absolute right-4 top-4 block cursor-pointer xl:hidden" onClick={onClose}>
          <HiX />
        </span>

        <ul className="mt-[50px] pt-1">
          <Link key={"home"} to={"/admin/nodes"}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li className="my-[3px] flex cursor-pointer items-center px-8" key={"h"}>
                <span className="font-medium text-gray-600">{<DashIcon />}</span>
                <p className={`leading-1 ml-4 flex font-medium text-gray-600`}>{"返回"}</p>
              </li>
            </div>
          </Link>
          <Link key={"home"} to={`/nodes/${id}/details`}>
            <div className="relative mb-3 flex hover:cursor-pointer">
              <li className="my-[3px] flex cursor-pointer items-center px-8" key={"h"}>
                <span className="font-medium text-gray-600">{<BiDetail />}</span>
                <p className={`leading-1 ml-4 flex font-medium text-gray-600`}>{"節點詳情"}</p>
              </li>
            </div>
          </Link>
        </ul>
        {/* <div className="mb-2 mt-[18px] h-px bg-gray-300 dark:bg-white/30" /> */}

        {routeConifg?.map((route: any) => {
          return (
            <>
              <div className="mb-[20px] mt-[40px] h-px bg-gray-300 dark:bg-white/30" />

              <div className={`ml-[20px] mr-[20px] flex items-center`}>
                <div className="ml-1 mt-1 h-2.5 font-poppins text-[18px] font-bold uppercase text-navy-700 dark:text-white">
                  {route.name}
                </div>
              </div>
              {/* Nav item */}

              <ul className="pt-10">
                <Links routes={route?.children?.filter((item: any) => item?.hidden !== true)} />
              </ul>

              {/* Nav item end */}
            </>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
