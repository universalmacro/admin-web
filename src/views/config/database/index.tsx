import React, { useEffect, useState } from "react";
import { basePath, getAdmins } from "api";
import { Table, Button, Modal, Checkbox, Input, Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import { AppDispatch } from "../../../store";
import {
  AdminApi,
  Configuration,
  ConfigurationParameters,
  NodeApi,
} from "@universalmacro/core-ts-sdk";
import { NavLink, useNavigate } from "react-router-dom";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const DatabaseConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nodeApi, setNodeApi] = useState(null);
  const [form] = Form.useForm();
  const { nodeInfo, nodeConfig } = useSelector((state: any) => state.node) || {};

  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};

  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

  // const getInfo = async (id: string) => {
  //   const res = await nodeApi?.getNodeConfig({ id: id });
  //   if (res) {
  //     setDatabaseConfig(res?.database);
  //   }
  // };

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
    // if (nodeConfig?.database) {
    form.setFieldsValue({
      ...nodeConfig?.database,
    });
    // }
  }, [nodeConfig?.database]);

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
        nodeConfig: { database: { ...values } },
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
            <p className="mb-4 inline text-xl">Database 配置</p>{" "}
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
                label="host"
                name="host"
                rules={[{ required: true, message: "請輸入host" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="port"
                name="port"
                rules={[{ required: true, message: "請輸入port" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="username"
                name="username"
                rules={[{ required: true, message: "請輸入username" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="password"
                name="password"
                rules={[{ required: true, message: "請輸入password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="database"
                name="database"
                rules={[{ required: true, message: "請輸入database" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="type" label="type" rules={[{ required: true, message: "請選擇" }]}>
                <Select
                  style={{ width: 120 }}
                  options={[
                    { value: "MYSQL", label: "MYSQL" },
                    { value: "POSTGRES", label: "POSTGRES" },
                  ]}
                />
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

export default DatabaseConfig;
