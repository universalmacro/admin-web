import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  restaurantApi,
  getPrinters,
  getDiscounts,
  createPrinter,
  updatePrinter,
  deletePrinter
} from "api";
import { Table, Button, Modal, Tag } from "antd";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "../../../../components/modal-form";
import DiscountModalForm from "../../../../components/discount-modal-form";

import { AppDispatch } from "../../../../store";
import { getRestaurantInfo } from "../../../../features/restaurant/restaurantActions";
import { Discount, Printer } from "types/restaurant";
import PrinterModalForm from "components/printer-modal-form";


const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dataSource, setDataSource] = useState([]);
  const [printerData, setPrinterData] = useState([]);
  const [printerVisible, setPrinterVisible] = useState(false);  // printer

  const [loading, setLoading] = useState(false);
  const [printerValue, setPrinterValue] = useState<Printer>({ name: "", id: "", sn: "", description: "", type: "BILL", model: "58mm" });

  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("userToken") || {};
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const { confirm } = Modal;

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };


  const onSavePrinter = async (values: any) => {
    console.log("onSavePrinter", values);
    try {
      const res = await createPrinter(
        restaurantId,
        values,
        {
          headers: getHeaders(),
        }
      );
      getPrinterList();

    } catch (e) { }
    setPrinterVisible(false);
  };

  const onUpdatePrinter = async (values: any) => {
    console.log(values);
    try {
      const res = await updatePrinter(
        values.id,
        values,
        {
          headers: getHeaders(),
        }
      );
      getPrinterList();

    } catch (e) { }
    setPrinterVisible(false);
  };

  const getPrinterList = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      let params = {
        headers: getHeaders(),
      };
      const res = await getPrinters(restaurantId, params);
      setPrinterData(res);
      setLoading(false);
    } catch (e) { }
  };

  const handleDeletePrinter = (record: any) => {
    showDeleteConfirm(async () => {
      console.log("onOK");
      try {
        const res = await deletePrinter(record.id, {
          headers: getHeaders(),
        });
        getPrinterList();
      } catch (e) { }
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


  const addPrinter = () => {
    setPrinterValue({ name: "", id: "", sn: "", description: "", type: "BILL", model: "58mm" });
    setPrinterVisible(true);
  };



  const editPrinter = (record: any) => {
    setPrinterValue({ ...record });
    setPrinterVisible(true);
  };


  useEffect(() => {
    getPrinterList();
  }, [userToken, restaurantId]);



  const printersColums = [
    {
      title: "打印機ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
      width: "15%",
    },
    {
      title: "打印機 SN",
      dataIndex: "sn",
      key: "sn",
      width: "15%",
    },
    {
      title: "模型",
      dataIndex: "model",
      key: "model",
      width: "10%",
      render: (text: string, record: any) => {
        let color = text === '58mm' ? 'green' : 'cyan';
        return (<Tag color={color} key={text}>
          {text}
        </Tag>);
      },
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => (
        <>
          <a className="mr-4 text-blue-400" onClick={() => editPrinter(record)} >編輯</a>
          <a className="text-red-400" onClick={() => handleDeletePrinter(record)}>
            刪除
          </a>
        </>
      ),
    },
  ];


  return (
    <div>
      <PrinterModalForm
        state={printerValue}
        visible={printerVisible}
        onSave={printerValue?.id == "" ? onSavePrinter : onUpdatePrinter}
        onCancel={() => {
          setPrinterVisible(false);
        }}
      />

      <div>
        <div className="flex justify-between">
          <p className="mb-4 text-xl">打印機列表</p>
          <Button onClick={addPrinter} icon={<RiAddFill />}>
            新增
          </Button>
        </div>
        <Table dataSource={printerData} columns={printersColums} loading={loading} />
      </div>
    </div>
  );
};

export default Tables;
