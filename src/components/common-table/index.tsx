import React from "react";
import { Table, Button, Input } from "antd";

const CommonTable = (props: {
  title?: string;
  columns?: any[];
  dataSource?: any[];
  loading?: boolean;
  onSearch?: (e: any) => void;
  onAddItem?: (e: any) => void;
  onChangePage?: (page: number, pageSize: number) => void;
  onRow?: (record: any, rowIndex: number) => any;
}) => {
  const { title, loading, columns, onChangePage, onSearch, dataSource, onAddItem, onRow } = props;

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          {onAddItem && (
            <div className="flex justify-between">
              <p className="mb-4 inline text-xl">{title}</p>{" "}
              <Button onClick={onAddItem}>+ 新增</Button>
            </div>
          )}
          {onSearch && (
            <Input.Search
              style={{ margin: "0 0 10px 0" }}
              placeholder="請輸入 ID / 角色 / 賬號 等搜索..."
              enterButton
              onSearch={onSearch}
            />
          )}
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            onRow={onRow}
            pagination={{
              onChange: onChangePage,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
