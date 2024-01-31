/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import { Link, useParams } from "react-router-dom";
import { detailRoute } from "routes";
import DashIcon from "components/icons/DashIcon";

const Sidebar = (props: { open: boolean; onClose: React.MouseEventHandler<HTMLSpanElement> }) => {
  const { open, onClose } = props;
  const { id } = useParams();

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span className="absolute right-4 top-4 block cursor-pointer xl:hidden" onClick={onClose}>
        <HiX />
      </span>

      <div className={`ml-[50px] mr-[50px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[24px] font-bold uppercase text-navy-700 dark:text-white">
          節點詳情 <span className="font-medium"></span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Link key={"nodes"} to={`/nodes/${id}/config/database`}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8" key={"h"}>
              <span className="font-medium text-gray-600">{<DashIcon />}</span>
              <p className={`leading-1 ml-4 flex font-medium text-gray-600`}>{"配置節點"}</p>
            </li>
          </div>
        </Link>
        <Links routes={detailRoute?.filter((item: any) => item?.hidden !== true)} id={id} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
