/* eslint-disable */
import { message } from "antd";

const CopyTextBtn = ({ text, className = "" }: any) => {
  const [messageApi, contextHolder] = message.useMessage();

  console.log("CopyTextBtn", text);

  const copySuccess = () => {
    messageApi.open({
      type: "success",
      content: "複製成功",
    });
  };

  return (
    <>
      {contextHolder}
      <span
        className={`cursor-pointer text-cyan-400 ${className} `}
        onClick={async (e: any) => {
          e.stopPropagation();
          await navigator.clipboard.writeText(text);
          copySuccess();
        }}
      >
        複製
      </span>
    </>
  );
};

export default CopyTextBtn;
