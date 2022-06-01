import React, { useEffect, useState } from "react";
import loading from "../public/Loading";
import { Table, Space, Form, Button, message, Select, Input, Modal, DatePicker, TimePicker } from "antd";
import Column from "antd/lib/table/Column";
import { useTable } from "../public/hooks"
import { AppBox } from "../public/component"
import { url, toggleScheduleStatus, insertNewSchedule, getStudioList } from "../public/interface";
import { useForm } from "antd/lib/form/Form";
import { format } from "../public/module";

const Option = Select.Option;
const { RangePicker } = DatePicker;

const AddSchedule = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [studio, setStudio] = useState([]);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const [form] = useForm();
  useEffect(() => {
    form.setFieldsValue({
      movieId: props.studio_id > 0 ? props.studio_id : "",
      status: 1
    });
    getStudioList().then((data) => {
      let res = JSON.parse(data);
      setStudio(res.data)
    })
  }, [props.studio_id, form])
  const handleOk = () => {
    let data = form.getFieldsValue();
    let [startDate, endDate] = data.date;
    let [startTime, endTime] = data.time;
    let sTime = new Date();
    sTime.setFullYear(startDate._d.getFullYear());
    sTime.setMonth(startDate._d.getMonth());
    sTime.setDate(startDate._d.getDate());
    sTime.setHours(startTime._d.getHours());
    sTime.setMinutes(startTime._d.getMinutes());
    sTime.setSeconds(startTime._d.getSeconds());
    let eTime = new Date();
    eTime.setFullYear(endDate._d.getFullYear());
    eTime.setMonth(endDate._d.getMonth());
    eTime.setDate(endDate._d.getDate());
    eTime.setHours(endTime._d.getHours());
    eTime.setMinutes(endTime._d.getMinutes());
    eTime.setSeconds(endTime._d.getSeconds());
    data.startTime = sTime.getTime();
    data.endTime = eTime.getTime();
    data.ticketPrice = parseFloat(data.ticketPrice);
    console.log(data);
    setConfirmLoading(true);
    insertNewSchedule(data).then((data) => {
      let res = JSON.parse(data)
      setConfirmLoading(false);
      if (!res.status) {
        message.success("添加成功");
        setIsModalVisible(false);
        props.reLoad();
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加
        </Button>
      <Modal
        title="添加一个演出计划"
        visible={isModalVisible}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        forceRender={true}
        footer={[
          <Button key="cance" onClick={handleCancel}>
            取消
            </Button>,
          <Button key="submit" type="primary"
            loading={confirmLoading}
            htmlType="submit"
            form="addSchedule"
          >
            提交
            </Button>,
        ]}
        width={600}
      >
        <Form
          {...layout}
          form={form}
          name="addSchedule"
          onFinish={handleOk}
        >
          <Form.Item label="电影id" name="movieId" rules={[{ required: true, message: "必填" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="演出厅" name="studioId" rules={[{ required: true, message: "必选" }]}>
            <Select>
              {setStudioOptions(studio)}
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date" rules={[{ required: true, message: "必选" }]}>
            <RangePicker placeholder={["选择开始日期", "选择结束日期"]} />
          </Form.Item>
          <Form.Item label="时间" name="time" rules={[{ required: true, message: "必选" }]}>
            <TimePicker.RangePicker placeholder={["选择开始时间", "选择结束时间"]} />
          </Form.Item>
          <Form.Item label="单价" name="ticketPrice" rules={[{ required: true, message: "必需是正数字",pattern :/^(\+)?\d+(\.\d+)?$/ }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: "必选" }]}>
            <Select>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

function setStudioOptions(data) {
  return data.map((value) => {
    return (<Option value={value.id} key={value.id}>{value.name}</Option>)
  })
}

const ScheduleApp = (props) => {
  const [form] = Form.useForm();
  const studioId = props.location.search ? parseInt(props.location.search.split("?")[1].split("&")[0].split("=")[1]) : -1
  const initFormValues = {
    movieId: studioId,
    sortName: "startTime",
    sortRule: "up",
    page: 1,
    pageLimit: 10
  };
  const table = useTable(url + "/ttms/schedule/allQuery", initFormValues, (data) => {
    if (data.dataSource) {
      data = {
        sum: 0,
        schedule: []
      };
    } else {
      data.schedule =  data.schedule.map((value) => {
        if (typeof value.status === "number") {
          value.status = value.status ? "已启用" : "未启用";
        }
        if (typeof value.startTime === "number" && typeof value.endTime === "number") {
          value.startTime = format(new Date(value.startTime), "yyyy-MM-dd hh:mm:ss")
          value.endTime = format(new Date(value.endTime), "yyyy-MM-dd hh:mm:ss")
        }
        return value;
      })
    }
    return data;
  });

  //更新显示顺序
  const onValuesChange = (p) => {
    let body = form.getFieldValue();
    table.modForm(body);
  }
  const toggleStatus = (id) => {
    toggleScheduleStatus(id).then((data) => {
      let res = JSON.parse(data);
      if (!res.status && res.data) {
        message.success(res.msg);
        onValuesChange();
      } else {
        message.error(res.msg)
      }
    }).catch(() => {
      message.error("网络无法到达");
    })
  }
  return (
    <AppBox>
      <Form
        form={form}
        layout="inline"
        className="table-form-box"
        onValuesChange={onValuesChange}
        initialValues={initFormValues}
      >
        <Form.Item name="sortName" label="排序方式">
          <Select>
            <Option value="startTime" key="startTime">开始时间</Option>
            <Option value="ticketPrice" key="ticketPrice">售价</Option>
          </Select>
        </Form.Item>
        <Form.Item name="sortRule" >
          <Select>
            <Option value="up" key="sort_up">升序</Option>
            <Option value="down" key="sort_down">降序</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <AddSchedule studio_id={studioId} reLoad={table.reLoad} />
        </Form.Item>
      </Form>
      <Table
        dataSource={table.data?table.data.schedule:[]}
        loading={{
          spinning: table.loading,
          indicator: loading,
        }}
        pagination={{
          total: table.data.sum,
          pageSize: 10,
          onChange: p => {
            table.modPage(p);
          },
          size: "middle"
        }}
        onRow={record => {
          return {
            onClick: e => {
              console.log(e.target.parentElement.getAttribute("data-row-key"));
            },
            className: "t-tr",
          }
        }}
        size="middle"
        rowKey={"scheduleId"}
      >
        <Column title="电影名称" dataIndex="movieName" />
        <Column title="演出厅" dataIndex="studioName" />
        <Column title="开始日期" dataIndex="startTime" />
        <Column title="结束日期" dataIndex="endTime" />
        <Column title="单价" dataIndex="ticketPrice" />
        <Column title="状态" dataIndex="status" />
        <Column title="操作" key="Action" render={(_, record) => {
          return (
            <Space size="middle" key="act">
              <Button type="link" danger={record.status === "已启用"} onClick={toggleStatus.bind(this, record.scheduleId)}>{record.status === "已启用" ? "禁用" : "启用"}</Button>
              {/* <Detail res={record} reLoad={reLoad} url={""}/>
                <Delete value={record} reLoad={reLoad} /> */}
            </Space>
          )
        }} />
      </Table>
    </AppBox>
  )
}

export default ScheduleApp;
