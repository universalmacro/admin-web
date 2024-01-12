import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTable,
  updateTable,
  deleteTable,
} from "api";
import { Table, Button, Modal } from "antd";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "./modal-form";
import { AppDispatch } from "../../../../store";
import { getRestaurantInfo } from "../../../../features/restaurant/restaurantActions";

const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableValue, setTableValue] = useState({ label: "", id: "" });

  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("userToken") || {};
  const { restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const { confirm } = Modal;

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const handleDeleteTable = (record: any) => {
    showDeleteConfirm(async () => {
      console.log("onOK");
      try {
        const res = await deleteTable(record.id, {
          headers: getHeaders(),
        });
        dispatch(getRestaurantInfo({ token: userToken }));

        console.log("handleDeleteTable", res);
      } catch (e) { }
    });
  };

  const onSave = async (values: any) => {
    console.log(values);
    try {
      const res = await createTable(
        restaurantId,
        { label: values.label },
        {
          headers: getHeaders(),
        }
      );
      dispatch(getRestaurantInfo({ token: userToken }));
    } catch (e) { }
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log(values);
    try {
      const res = await updateTable(
        values.id,
        { label: values.label },
        {
          headers: getHeaders(),
        }
      );
      dispatch(getRestaurantInfo({ token: userToken }));
    } catch (e) { }
    setVisible(false);
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

  const addTable = () => {
    setTableValue({ label: "", id: "" });
    setVisible(true);
  };


  const editTable = (record: any) => {
    setTableValue({ label: record.label, id: record.id });
    setVisible(true);
  };


  const tableColums = [
    {
      title: "餐桌ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "餐桌標簽",
      dataIndex: "label",
      key: "label",
      width: "20%",
    },

    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => (
        <>
          <a onClick={() => editTable(record)} className="mr-4 text-blue-400">
            編輯
          </a>
          <a className="text-red-400" onClick={() => handleDeleteTable(record)}>
            刪除
          </a>
        </>
      ),
    },
  ];

  return (
    <div>
      <ModalForm
        state={tableValue}
        visible={visible}
        onSave={tableValue?.label == "" ? onSave : onUpdate}
        onCancel={() => {
          setVisible(false);
        }}
      />



      <div>
        <div className="flex justify-between">
          <p className="mb-4 inline text-xl">餐桌列表</p>
          <Button onClick={addTable} icon={<RiAddFill />}>
            新增
          </Button>
        </div>
        <Table dataSource={restaurantInfo?.tables} columns={tableColums} loading={loading} />
      </div>

    </div>
  );
};

export default Tables;
