import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  restaurantApi,
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "api";
import { Table, Button, Modal, Tag } from "antd";
import { RiAddFill } from "react-icons/ri";
import DiscountModalForm from "../../../../components/discount-modal-form";

import { AppDispatch } from "../../../../store";
import { getRestaurantInfo } from "../../../../features/restaurant/restaurantActions";
import { Discount, Printer } from "types/restaurant";
import PrinterModalForm from "components/printer-modal-form";


const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [discountData, setDiscountData] = useState([]);
  const [discountVisible, setDiscountVisible] = useState(false);  // discount

  const [loading, setLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState<Discount>({ label: "", id: "", offset: 0 });

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

  const onSaveDiscount = async (values: any) => {
    console.log(values);
    try {
      const res = await createDiscount(
        restaurantId,
        { label: values.label, offset: values.offset },
        {
          headers: getHeaders(),
        }
      );
      getDiscountList();

    } catch (e) { }
    setDiscountVisible(false);
  };

  const onUpdateDiscount = async (values: any) => {
    console.log(values);
    try {
      const res = await updateDiscount(
        values.id,
        { label: values.label, offset: values.offset },
        {
          headers: getHeaders(),
        }
      );
      getDiscountList();

    } catch (e) { }
    setDiscountVisible(false);
  };



  const getDiscountList = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      let params = {
        headers: getHeaders(),
      };
      const res = await getDiscounts(restaurantId, params);
      setDiscountData(res);
      setLoading(false);
    } catch (e) { }
  };



  const handleDeleteDiscount = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        const res = await deleteDiscount(record.id, {
          headers: getHeaders(),
        });
        getDiscountList();

        console.log("handleDeleteDiscount", res);
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



  const addDiscount = () => {
    setDiscountValue({ label: "", id: "", offset: 0 });
    setDiscountVisible(true);
  };


  const editDiscount = (record: any) => {
    setDiscountValue({ ...record });
    setDiscountVisible(true);
  };



  useEffect(() => {
    getDiscountList();
  }, [userToken, restaurantId]);

  const discountColums = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "折扣標籤",
      dataIndex: "label",
      key: "label",
      width: "30%",
    },
    {
      title: "折扣",
      dataIndex: "offset",
      key: "offset",
      width: "10%",
      render: (text: number, record: any) => (
        <>
          {text}%
        </>
      ),
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: Discount) => (
        <>
          <a className="mr-4 text-blue-400" onClick={() => editDiscount(record)}>編輯</a>
          <a className="text-red-400" onClick={() => handleDeleteDiscount(record)}>刪除</a>
        </>
      ),
    },
  ];

  return (
    <div>


      <DiscountModalForm
        state={discountValue}
        visible={discountVisible}
        onSave={discountValue?.label == "" ? onSaveDiscount : onUpdateDiscount}
        onCancel={() => {
          setDiscountVisible(false);
        }}
      />



      <div>
        <div className="flex justify-between">
          <p className="mb-4 text-xl">折扣列表</p>
          <Button onClick={addDiscount} icon={<RiAddFill />}>
            新增
          </Button>
        </div>
        <Table dataSource={discountData} columns={discountColums} loading={loading} />
      </div>

    </div>
  );
};

export default Tables;
