import React, { useEffect, useState, useCallback, useMemo } from "react";
import { restaurantApi, getPrinters, createAdmins, basePath, updateTable, getAdmins, deleteItems } from "api";
import { Table, Button, Modal, Tag, Input, DatePicker, Space, Pagination } from "antd";
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { toTimestamp } from "../../../utils/utils";
import { useDispatch, useSelector } from 'react-redux';
import { RiAddFill } from "react-icons/ri";
import { AppDispatch } from '../../../store';
import { getRestaurantInfo } from "../../../features/restaurant/restaurantActions";
import { defaultImage } from "../../../utils/constant";
import { NavLink, useNavigate } from 'react-router-dom';
import ModalForm from "./modal-form";
import sha256 from 'crypto-js/sha256';


import {
  AdminApi,
  Configuration,
  ConfigurationParameters,
} from "@universalmacro/core-ts-sdk";

const paginationConfig = {
  pageSize: 10,
  page: 0,
}


const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tagFilters, setTagFilters] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { userToken } = useSelector((state: any) => state.auth) || localStorage.getItem('admin-web-token') || {};
  const { restaurantList, restaurantId, restaurantInfo } = useSelector((state: any) => state.restaurant) || {};
  const [dataSource, setDataSource] = useState(restaurantInfo?.items);
  const navigate = useNavigate();

  const { confirm } = Modal;



  // useEffect(() => {
  //   setDataSource(restaurantInfo?.items);
  //   let filters: any = [];
  //   restaurantInfo?.categories?.map((e: any) => {
  //     filters.push({ text: e, value: e });
  //   })
  //   setTagFilters(filters);
  // }, [restaurantId]);

  const onChangePage = (page: number, pageSize: number) => {
    getAdminList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  }


  const getAdminList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await getAdmins({
        headers: getHeaders(),
        params: { ...pagination },
      });
      setDataSource(res?.items);
      setLoading(false);
    } catch (e) {
      console.log("getAdminList", e);
      setLoading(false);
    }

  }

  useEffect(() => {
    getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [userToken]);

  // useEffect(() => {
  //   console.log("useEffectuseEffectuseEffect", restaurantInfo?.items);
  //   setDataSource(restaurantInfo?.items);
  // }, restaurantInfo?.items);

  // useEffect(() => {
  //   dispatch(getRestaurantInfo({ token: userToken }));
  // }, []);


  const getHeaders = () => {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${userToken}`,
    };
  }

  const onSave = async (values: any) => {
    console.log("onSave===================", values);
    const adminApi = new AdminApi(
      new Configuration({
        basePath: basePath,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      } as ConfigurationParameters)
    );

    try {
      const res = await createAdmins({ ...values, password: sha256(sha256(values?.password).toString()).toString() }, {
        headers: getHeaders()
      });
      // const res = await adminApi.createAdmin({ ...values });
    } catch (e) {

    }
    setVisible(false);
  }

  const onUpdate = async (values: any) => {
    console.log(values);
    try {
      const res = await updateTable(values.id, { label: values.label }, {
        headers: getHeaders()
      });
      dispatch(getRestaurantInfo({ token: userToken }));
    } catch (e) {

    }
    setVisible(false);
  }




  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      // try {
      //   const res = await deleteItems(record.id, {
      //     headers: getHeaders()
      //   });
      //   console.log("handleDelete", res);
      // } catch (e) {

      // }

    }


    );
  }

  const showDeleteConfirm = (onOk: any) => {
    confirm({
      title: '確認刪除？',
      // icon: <ExclamationCircleFilled />,
      // content: '確認刪除？',
      okText: '確認',
      okType: 'danger',
      cancelText: '取消',
      onOk,
      onCancel() {
        console.log('OK');
      },
    });
  };

  const search = (value: string) => {
    if (value === '') {
      getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = dataSource.filter((o: any) =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );

    setDataSource(filterTable);
  };


  const addPerson = () => {
    setVisible(true);
  }



  const colums = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: '賬號',
      dataIndex: 'account',
      key: 'account',
      width: '10%',
    },
    {
      title: '提交時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (text: any, record: any) => (
        <>
          {new Date(text * 1000).toLocaleString()}
        </>
      ),
    },
    {
      title: '更新時間',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '20%',
      render: (text: any, record: any) => (
        <>
          {new Date(text * 1000).toLocaleString()}
        </>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: 'role',
      width: '15%',
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      render: (text: string, record: any) => {
        let color = text === 'ROOT' ? 'geekblue' : 'cyan';
        return (<Tag color={color} key={text}>
          {text}
        </Tag>);
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (text: any, record: any) => (<><a className="text-blue-400 mr-4">編輯</a>
        <a className="text-red-400" onClick={() => handleDelete(record)}>刪除</a></>),
    },
  ];


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


      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <div className="flex justify-between"><p className="text-xl mb-4 inline">人員列表</p> <Button onClick={addPerson} icon={<RiAddFill />}>新增</Button></div>
          <Input.Search
            style={{ margin: "0 0 10px 0" }}
            placeholder="請輸入 ID / 角色 / 賬號 等搜索..."
            enterButton
            onSearch={search}
          />
          <Table dataSource={dataSource} columns={colums} loading={loading} pagination={{
            onChange: onChangePage,
          }} />

        </div>

      </div>

    </div>
  );
};

export default Tables;
