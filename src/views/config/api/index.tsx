import { useEffect, useState } from "react";
import { basePath } from "api";
import { Button, Modal, Checkbox, Input, Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { Configuration, ConfigurationParameters, NodeApi } from "@universalmacro/core-ts-sdk";

const ApiConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [nodeApi, setNodeApi] = useState(null);
  const [apiConfig, setApiConfig] = useState(null);

  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const { confirm } = Modal;

  const { nodeInfo, nodeConfig } = useSelector((state: any) => state.node) || {};
  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};

  useEffect(() => {
    if (!nodeApi) {
      setNodeApi(
        new NodeApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
  }, [nodeApi, userInfo?.id, userToken]);

  useEffect(() => {
    form.setFieldsValue({
      ...nodeConfig?.api,
    });
  }, [nodeConfig?.api]);

  const successCallback = () => {
    Modal.success({
      content: "操作成功！",
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const onUpdate = async (values: any) => {
    try {
      let params = {
        id: nodeInfo?.id,
        nodeConfig: { api: { ...values } },
      };
      console.log(params);
      try {
        const res = await nodeApi?.updateNodeConfig({ ...params });
        if (res) {
          setComponentDisabled(true);
          successCallback();
        }
      } catch (e) {
        errorCallback(e);
      }
    } catch (e) {}
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <div className="flex justify-between">
            <p className="mb-4 inline text-xl">API 配置</p>{" "}
          </div>

          <div className="mt-5 flex grid h-full grid-cols-1 items-center justify-center gap-5 rounded-lg bg-white p-8">
            <Checkbox
              checked={!componentDisabled}
              onChange={(e: any) => setComponentDisabled(!e.target.checked)}
            >
              編輯
            </Checkbox>
            <Form
              form={form}
              disabled={componentDisabled}
              onFinish={onUpdate}
              onFinishFailed={onFinishFailed}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              autoComplete="off"
            >
              <Form.Item
                label="merchantUrl"
                name="merchantUrl"
                rules={[{ required: true, message: "請輸入merchantUrl" }]}
              >
                <Input />
              </Form.Item>
              {!componentDisabled && (
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfig;
