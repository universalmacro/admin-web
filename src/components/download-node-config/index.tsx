/* eslint-disable */
import * as YAML from "yaml";
import { Modal } from "antd";

const DownLoadNodeConfigBtn = ({ record, className = "" }: any) => {
  console.log("DownLoadNodeConfigBtnDownLoadNodeConfigBtn", record);
  const errorCallback = () => {
    Modal.error({
      content: "無法獲取配置信息",
    });
  };

  const handleDownload = (record: any) => {
    if (!record) {
      errorCallback();
    }

    let info = {
      core: {
        apiUrl: "https://uat.api.universalmacro.com/core",
      },
      node: {
        id: record?.id,
        secretKey: record?.securityKey,
      },
    };

    // 創建文件並下載
    const fileData = YAML.stringify(info);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${record?.id}.yaml`;
    link.href = url;
    link.click();
  };

  return (
    <>
      <span
        className={`cursor-pointer text-cyan-400 ${className} `}
        onClick={(e: any) => {
          e.stopPropagation();
          handleDownload(record);
        }}
      >
        下載
      </span>
    </>
  );
};

export default DownLoadNodeConfigBtn;
