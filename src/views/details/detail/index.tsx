import { useEffect, useState } from "react";
import { basePath } from "api";
import type { DescriptionsProps } from "antd";
import { Modal, Tooltip, Card, Dropdown, MenuProps, Descriptions } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { NavLink, useNavigate } from "react-router-dom";
import ModalForm from "./modal-form";
import { useParams } from "react-router-dom";
import sha256 from "crypto-js/sha256";
import { Configuration, ConfigurationParameters, NodeApi } from "@universalmacro/core-ts-sdk";
import UpdateModalForm from "./update-modal-form";

import {
  Configuration as MerchantConfig,
  ConfigurationParameters as MerchantConfigParams,
  MerchantApi,
} from "@universalmacro/merchant-ts-sdk";
import CommonTable from "components/common-table";
// import { CommonTable } from "@macro-components/common-components";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const Tables = () => {
  const navigate = useNavigate();
  const [merchantApi, setMerchantApi] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const [dataSource, setDataSource] = useState([]);
  const [nodeApi, setNodeApi] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [nodeConfig, setNodeConfig] = useState(null);
  const [recordVal, setRecordVal] = useState({});
  const [updateVisible, setUpdateVisible] = useState(false);
  const [items, setItems] = useState(null);
  const [nodeItems, setNodeItems] = useState(null);

  const { id } = useParams();

  const { confirm } = Modal;

  useEffect(() => {
    console.log(nodeConfig?.api?.merchantUrl, nodeInfo?.securityKey, merchantApi);
    if (nodeConfig?.api?.merchantUrl && nodeInfo?.securityKey) {
      setMerchantApi(
        new MerchantApi(
          new MerchantConfig({
            basePath: nodeConfig?.api?.merchantUrl,
            headers: {
              Authorization: `Bearer ${userToken}`,
              ApiKey: nodeInfo?.securityKey,
            },
          } as MerchantConfigParams)
        )
      );
    }
    getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [userInfo?.id, userToken, nodeConfig, nodeInfo]);

  useEffect(() => {
    if (merchantApi && nodeConfig?.api?.merchantUrl && nodeInfo?.securityKey) {
      getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [merchantApi]);

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
    getInfo(id);
    // getConfigInfo(id);
  }, [nodeApi, userInfo?.id, userToken, id]);

  const getInfo = async (id: string) => {
    try {
      const res = await nodeApi?.getNode({ id: id });
      if (res) {
        setNodeInfo(res);
      }
      const config = await nodeApi?.getNodeConfig({ id: id });
      if (res) {
        setNodeConfig(config);
      }
      buildNodeData(res);
      buildInfoData(config);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/admin/nodes");
    }
  }, [id]);

  const onChangePage = (page: number, pageSize: number) => {
    getMerchantsList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getMerchantsList = async (page: number, pageSize: number) => {
    if (!nodeInfo) return;
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await merchantApi?.listMerchants({ ...pagination });
      setDataSource(res?.items ?? []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onSave = async (values: any) => {
    try {
      const res = await merchantApi?.createMerchant({
        createMerchantRequest: {
          shortMerchantId: values?.shortMerchantId,
          account: values?.account,
          password: sha256(sha256(values?.password).toString()).toString(),
        },
      });
      getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {
      errorCallback(e);
    }
    setVisible(false);
  };

  const updatePassword = async (values: any) => {
    try {
      const res = await merchantApi?.updateMerchantPassword({
        id: values?.id,
        updatePasswordRequest: {
          oldPassword: sha256(sha256(values?.password).toString()).toString(),
          password: sha256(sha256(values?.password).toString()).toString(),
        },
      });
      setUpdateVisible(false);
      successCallback();
    } catch (e) {
      errorCallback(e);
    }
  };

  const onUpdate = async (values: any) => {
    setUpdateVisible(true);
  };

  const successCallback = () => {
    Modal.success({
      content: "創建成功！",
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        // const res = await deleteItems(record.id, {
        //   headers: getHeaders()
        // });
        // const res = await nodeApi?.deleteNode({ id: record?.id });
        // getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {
        errorCallback(e);
      }
    });
  };

  const showDeleteConfirm = (onOk: any) => {
    confirm({
      title: "確認刪除？",
      // icon: <ExclamationCircleFilled />,
      // content: '確認刪除？',
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
  };

  const search = (value: string) => {
    if (value === "") {
      getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = dataSource?.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setDataSource(filterTable);
  };

  const addPerson = () => {
    setVisible(true);
  };

  const buildInfoData = (config: any) => {
    if (!config) return;
    let items: any = {};
    Object.keys(config).forEach(function (key) {
      let tmp: DescriptionsProps["items"] = [];
      if (!config[key]) return;
      Object.keys(config[key])?.forEach(function (configKey) {
        tmp.push({
          key: configKey,
          label: configKey,
          children: config[key][configKey],
        });
      });
      items[key] = tmp;
    });
    console.log(items);
    setItems(items);
    return items;
  };

  const buildNodeData = (info: any) => {
    if (!info) return;
    let items: DescriptionsProps["items"] = [];

    Object.keys(info)?.forEach(function (configKey) {
      items.push({
        key: configKey,
        label: configKey,
        children: info[configKey],
      });
    });

    setNodeItems(items);
  };

  return (
    <div>
      <ModalForm
        state={formValues}
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <UpdateModalForm
        state={recordVal}
        visible={updateVisible}
        onSave={updatePassword}
        onCancel={() => {
          setUpdateVisible(false);
        }}
      />
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div className="mt-5 grid h-full grid-cols-1 gap-5">
          <p className="mb-4 text-xl">節點詳情</p>
        </div>
        <Descriptions layout="vertical" bordered items={nodeItems} />
        <div className="mt-5 grid h-full grid-cols-1 gap-5">
          <p className="mb-4 text-xl">配置信息</p>
        </div>
        {items &&
          Object.keys(items)?.map((key: any) => {
            return (
              <div className="mt- 5">
                <Card
                  title={key}
                  extra={<a href={`/nodes/${id}/config/${key}`}>前往編輯</a>}
                  style={{ width: "80%" }}
                >
                  <Descriptions layout="vertical" items={items[key]} />
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Tables;
