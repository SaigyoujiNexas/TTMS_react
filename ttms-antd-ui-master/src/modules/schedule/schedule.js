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
        message.success("????????????");
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
        ??????
        </Button>
      <Modal
        title="????????????????????????"
        visible={isModalVisible}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        forceRender={true}
        footer={[
          <Button key="cance" onClick={handleCancel}>
            ??????
            </Button>,
          <Button key="submit" type="primary"
            loading={confirmLoading}
            htmlType="submit"
            form="addSchedule"
          >
            ??????
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
          <Form.Item label="??????id" name="movieId" rules={[{ required: true, message: "??????" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="?????????" name="studioId" rules={[{ required: true, message: "??????" }]}>
            <Select>
              {setStudioOptions(studio)}
            </Select>
          </Form.Item>
          <Form.Item label="??????" name="date" rules={[{ required: true, message: "??????" }]}>
            <RangePicker placeholder={["??????????????????", "??????????????????"]} />
          </Form.Item>
          <Form.Item label="??????" name="time" rules={[{ required: true, message: "??????" }]}>
            <TimePicker.RangePicker placeholder={["??????????????????", "??????????????????"]} />
          </Form.Item>
          <Form.Item label="??????" name="ticketPrice" rules={[{ required: true, message: "??????????????????",pattern :/^(\+)?\d+(\.\d+)?$/ }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="??????" name="status" rules={[{ required: true, message: "??????" }]}>
            <Select>
              <Option value={1}>??????</Option>
              <Option value={0}>??????</Option>
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
          value.status = value.status ? "?????????" : "?????????";
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

  //??????????????????
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
      message.error("??????????????????");
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
        <Form.Item name="sortName" label="????????????">
          <Select>
            <Option value="startTime" key="startTime">????????????</Option>
            <Option value="ticketPrice" key="ticketPrice">??????</Option>
          </Select>
        </Form.Item>
        <Form.Item name="sortRule" >
          <Select>
            <Option value="up" key="sort_up">??????</Option>
            <Option value="down" key="sort_down">??????</Option>
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
        <Column title="????????????" dataIndex="movieName" />
        <Column title="?????????" dataIndex="studioName" />
        <Column title="????????????" dataIndex="startTime" />
        <Column title="????????????" dataIndex="endTime" />
        <Column title="??????" dataIndex="ticketPrice" />
        <Column title="??????" dataIndex="status" />
        <Column title="??????" key="Action" render={(_, record) => {
          return (
            <Space size="middle" key="act">
              <Button type="link" danger={record.status === "?????????"} onClick={toggleStatus.bind(this, record.scheduleId)}>{record.status === "?????????" ? "??????" : "??????"}</Button>
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
