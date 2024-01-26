import { useEffect, useState } from "react";
import { basePath } from "api";
import { Table, message, Modal, Tooltip, Input, Dropdown, MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { NavLink, useNavigate } from "react-router-dom";
import ModalForm from "./modal-form";
import { DownOutlined } from "@ant-design/icons";

import { Configuration, ConfigurationParameters, NodeApi } from "@universalmacro/core-ts-sdk";
import CommonTable from "components/common-table";
// import { CommonTable } from "@macro-components/common-components";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const items: MenuProps["items"] = [
  { key: "database", label: "database" },
  { key: "server", label: "server" },
  { key: "redis", label: "redis" },
  { key: "api", label: "api" },
];

const Tables = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [nodeApi, setNodeApi] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const [dataSource, setDataSource] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = Modal;

  const onChangePage = (page: number, pageSize: number) => {
    getNodeList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getNodeList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await nodeApi?.listNode({ ...pagination });
      setDataSource(res?.items ?? []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

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
    getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [nodeApi, userInfo?.id, userToken]);

  const onSave = async (values: any) => {
    try {
      const res = await nodeApi.createNode({
        createNodeRequest: {
          name: values?.name,
          description: values?.description,
        },
      });
      successCallback();
      getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const toConfig = (key: any, record: any) => {
    console.log("toConfig", key, record);
    // navigate(`/config/${key}`, { state: { info: record } });
    navigate(`/nodes/${record?.id}/config/${key}`);
  };

  const successCallback = () => {
    Modal.success({
      content: "創建成功！",
    });
  };

  const copySuccess = () => {
    messageApi.open({
      type: "success",
      content: "複製成功",
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
        const res = await nodeApi?.deleteNode({ id: record?.id });
        getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
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
      getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
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
      title: "節點名稱",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: "15%",
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
      title: "安全碼",
      dataIndex: "securityKey",
      key: "securityKey",
      width: "10%",
      render: (text: any, record: any) => {
        if (!text) {
          return <>無</>;
        } else {
          return (
            <>
              <Tooltip title={text} overlayInnerStyle={{ width: "520px" }} trigger="click">
                <span className="mr-4 cursor-pointer text-cyan-400">查看</span>
              </Tooltip>

              <span
                className="cursor-pointer text-cyan-400"
                onClick={() => {
                  // navigator.clipboard.writeText(text);
                  copySuccess();
                }}
              >
                複製
              </span>
            </>
          );
        }
      },
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
      width: "20%",
      hidden: userInfo?.role !== "ROOT",
      render: (text: any, record: any) => (
        <>
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                // dispatch(setNode(record));
                toConfig(key, record);
              },
            }}
          >
            <a className="mr-4 text-blue-400">
              配置 <DownOutlined />
            </a>
          </Dropdown>
          {/* <a
            className="mr-4 text-blue-400"
            onClick={() => {
              getInfo(record);
            }}
          >
            詳情
          </a> */}
          <a
            className="mr-4 text-blue-400"
            onClick={() => {
              navigate(`/nodes/${record?.id}/merchant`);
            }}
          >
            帳號管理
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
      {contextHolder}
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <CommonTable
            title="節點列表"
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
