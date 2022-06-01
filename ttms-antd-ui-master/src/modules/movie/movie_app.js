import loading from "../public/Loading";
import React from 'react';
import { Space, Form, Select, Table, Input} from "antd";
import { url } from "../public/interface";
import { InputFilm } from "./input_movie";
import { Detail } from "./movie_detail";
import { AppBox, Delete } from "../public/component";
import { useTable } from "../public/hooks";
// import { useEffect, useState } from "react";
const Column = Table.Column;
const { Option } = Select;

const initFormValues = {
  sortType: "rate",
  sortRule: "down",
  page: 1
}

export default function FilmsApp() {
  const [form] = Form.useForm();
  const table = useTable(url + "/ttms/movie/getList", initFormValues, (data) => {
    data.dataSource = data.dataSource.map((v) => {
      if (typeof v.releaseDate === "number") {
        let time = new Date(v.releaseDate);
        v.releaseDate = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`;
        v.key = v.mid;
        return v;
      }
      return v;
    });
    return data;
  });

  //更新显示顺序
  const onValuesChange = () => {
    let body = form.getFieldValue();
    table.modForm(body);
  }

  return (
    <AppBox>
      <Form
        form={form}
        layout="inline"
        className="table-form-box"
        initialValues={initFormValues}
      >
        <Form.Item name="search" label="搜索">
          <Input.Search placeholder="输入搜索内容" onSearch={onValuesChange} enterButton />
        </Form.Item>
        <Form.Item name="sortType" label="排序方式">
          <Select onChange={onValuesChange}>
            <Option value="rate">评分</Option>
            <Option value="title">标题</Option>
            <Option value="releaseDate">上映日期</Option>
          </Select>
        </Form.Item>
        <Form.Item name="sortRule" >
          <Select onChange={onValuesChange}>
            <Option value="up">升序</Option>
            <Option value="down">降序</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <InputFilm reLoad={table.reLoad} />
        </Form.Item>
      </Form>
      <Table
        size="large"
        dataSource={table.data.dataSource}
        loading={{
          spinning: table.loading,
          indicator: loading,
        }}
        pagination={{
          total: table.data.sum,
          pageSize: 10,
          showSizeChanger: false,
          onChange: p => {
            table.modPage(p);
          }
        }}
        onRow={record => {
          return {
            className: "t-tr",
          }
        }}
        rowKey="mid"
      >
        <Column title="id" dataIndex="mid" />
        <Column title="标题" dataIndex="title" />
        <Column title="类型" dataIndex="type" />
        <Column title="片长" dataIndex="filmlen" />
        <Column title="上映日期" dataIndex="releaseDate" />
        <Column title="评分" dataIndex="rate" />
        <Column title="操作" key="mid"
          render={(_, record) => {
            return (
              <Space size="middle">
                <Detail res={record} reLoad={table.reLoad} />
                <Delete
                  dataID={record.key}
                  reLoad={table.reLoad}
                  url={url + "/ttms/movie/delete"}
                />
              </Space>
            )
          }}
        />
      </Table>
    </AppBox>
  )
}


