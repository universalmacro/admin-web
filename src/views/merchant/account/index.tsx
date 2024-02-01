import { useEffect, useState } from "react";
import { basePath } from "api";
import { Modal, Tooltip, Input, Dropdown, MenuProps } from "antd";
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
// import "@macro-components/common-components/dist/style.css";

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
    // getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [userInfo?.id, userToken, nodeConfig, nodeInfo]);

  useEffect(() => {
    if (merchantApi && nodeConfig?.api?.merchantUrl && nodeInfo?.securityKey) {
      getMerchantsList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [merchantApi, nodeConfig, nodeInfo]);

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
  }, [nodeApi, userInfo?.id, userToken, id]);

  // 需要通過節點信息和節點配置信息獲取 basePath 和 Apikey
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
      content: "修改成功！",
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

  const colums = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "名稱",
      dataIndex: "account",
      key: "account",
      width: "10%",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: "10%",
      onCell: () => {
        return {
          style: {
            maxWidth: 10,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer",
          },
        };
      },
      render: (text: any, record: any) => {
        if (!text) {
          return <>無</>;
        } else {
          return (
            <Tooltip title={text} overlayInnerStyle={{ maxWidth: "40px" }}>
              <span className="cursor-pointer">{text}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: "shortMerchantId",
      dataIndex: "shortMerchantId",
      key: "shortMerchantId",
      width: "10%",
      // render: (text: any, record: any) => {
      //   if (!text) {
      //     return <>無</>;
      //   } else {
      //     return (
      //       <Tooltip title={text} overlayInnerStyle={{ width: "520px" }} trigger="click">
      //         <span className="cursor-pointer text-cyan-400">查看</span>
      //       </Tooltip>
      //     );
      //   }
      // },
    },
    {
      title: "提交時間",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "14%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "更新時間",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "14%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },

    {
      title: "操作",
      key: "operation",
      hidden: userInfo?.role !== "ROOT",
      render: (text: any, record: any) => (
        <>
          <a
            className="mr-4 text-blue-400"
            onClick={() => {
              setRecordVal(record);
              onUpdate(record);
            }}
          >
            更新密碼
          </a>
          <a className="text-red-400" onClick={() => handleDelete(record)}>
            刪除
          </a>
        </>
      ),
    },
  ].filter((item) => !item.hidden);

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
        <div>
          <CommonTable
            title="帳號列表"
            onAddItem={addPerson}
            onSearch={search}
            dataSource={dataSource}
            columns={colums}
            loading={loading}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Tables;
