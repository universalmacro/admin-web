import { useEffect, useState } from "react";
import { basePath } from "api";
import { Button, Modal, Checkbox, Input, Form } from "antd";
import { useSelector } from "react-redux";
import { Configuration, ConfigurationParameters, NodeApi } from "@universalmacro/core-ts-sdk";
import { useParams, useNavigate } from "react-router-dom";

const ServerConfig = () => {
  const [nodeApi, setNodeApi] = useState(null);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};

  const getConfigInfo = async (id: string) => {
    setLoading(true);
    try {
      const res = await nodeApi?.getNodeConfig({ id: id });
      if (res) {
        setServerConfig(res?.server);
      }
      setLoading(false);
    } catch (e) {
      errorCallback(e, () => {
        navigate("/admin/nodes");
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/admin/nodes");
    }
  }, [id]);

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
    getConfigInfo(id);
  }, [nodeApi, userInfo?.id, userToken, id]);

  useEffect(() => {
    if (serverConfig) {
      form.setFieldsValue({
        ...serverConfig,
      });
    }
  }, [serverConfig]);

  const successCallback = () => {
    Modal.success({
      content: "操作成功！",
    });
  };

  const errorCallback = (e: any, afterClose: any = () => {}) => {
    Modal.error({
      content: `${e}`,
      afterClose: afterClose,
    });
  };

  const onUpdate = async (values: any) => {
    try {
      let params = {
        id: id,
        nodeConfig: { server: { ...values } },
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
            <p className="mb-4 inline text-xl">Server 配置</p>{" "}
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
                label="port"
                name="port"
                rules={[{ required: true, message: "請輸入port" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="jwtSecret"
                name="jwtSecret"
                rules={[{ required: true, message: "請輸入jwtSecret" }]}
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

export default ServerConfig;
