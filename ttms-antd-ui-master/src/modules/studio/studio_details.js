import { Button, Card, message, Tooltip, Select, Modal, PageHeader , Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Seat } from "./seat";
import { AppBox, Circle } from "../public/component";
import { getStudioSeatById, modStudio } from "../public/interface";
import { useForm } from "antd/lib/form/Form";

const Option = Select.Option;
export function HallDetails(props) {
  if (!(props.location.state || sessionStorage.getItem("studio"))) {
    window.location = "./main"
  }
  const [studio, setStudio] = useState(props.location.state || JSON.parse(sessionStorage.getItem("studio")));
  const [seats, setSeats] = useState([]);
  const [sum, setSum] = useState({
    sum: 0,
    errnum: 0,
    oknum: 0
  })
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps

    load();
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const load = async () => {
    try {
      let res = JSON.parse(await getStudioSeatById(studio.id));
      if (!res.status) {
        let errnum = 0;
        let oknum = 0;
        res.data.forEach(value => {
          if (value.status === 0) {
            errnum++;
          } else if (value.status === 1) {
            oknum++;
          }
        });
        setSum({
          sum: res.data.length,
          errnum: errnum,
          oknum: oknum
        })
        setSeats(res.data);
      }
    } catch (err) {
      message.error("网络无法到达")
      console.log(err);
    }
  }
  return (
    <AppBox>
      <PageHeader
        className="site-page-header"
        onBack={() => {window.history.back(-1)}}
        title="演出厅详情"
        style={{backgroundColor: "#fff"}}
      />
      <Card title={studio.name}>
        <div className="flex-box" style={{ justifyContent: "space-between" }}>
          <div className="flex-box">
            <div>座位总数：{sum.sum}</div>
            <div>
              <Tooltip title="可用">
                <Circle color="#52c41a" />
                <span>{sum.oknum}</span>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="不可用">
                <Circle color="red" />
                <span>{sum.errnum}</span>
              </Tooltip>
            </div>
          </div>
          <Modified setStudio={setStudio} value={studio} reLoad={load}></Modified>
        </div>

      </Card>

      <br />
      <Card title={"座位分布图"}>
        {setSeat(studio, seats, load)}
      </Card>

    </AppBox>
  )
}


function setSeat(studio, seats, reload) {
  if (seats.length) {
    const row = studio.row;
    const col = studio.col;
    if (row * col !== seats.length) {
      return [];
    }
    let res = [];
    let sum = 0;
    const setCol = (row) => {
      let colRes = [];
      for (let j = 0; j <= col; j++) {
        if (row > 0 && j > 0) {
          let status = "ok";
          if (seats[sum].status === 0) {
            status = "error"
          }
          colRes.push(<Seat type={status} key={"id:" + seats[sum].seatId} data_id={seats[sum].seatId} reload={reload} />);
          sum++;
        } else if (!(row === 0 && j === 0)) {
          colRes.push(<Seat type="num" key={"num:" + row + j} num={row === 0 ? j : row} />)
        } else {
          colRes.push(<Seat type="none" key={"none:" + row + j} />)
        }
      }
      return colRes
    }
    for (let i = 0; i <= row; i++) {
      res.push(<div className="flex-box" style={{ marginBottom: 5 }} key={i}>
        {setCol(i)}
      </div>)
    }
    return res;
  } else {
    return <div></div>
  }
}

function Modified(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [btnLoading, setBtn] = useState(false)
  const [form] = useForm();
  const onCancel = () => {
    setModalVisible(false);
  }
  const showModal = () => {
    setModalVisible(true)
  }
  useEffect(() => {
    form.setFieldsValue({
      row: props.value.row,
      col: props.value.col,
      status: props.value.status,
      name: props.value.name,

    })
  }, [props, form])
  const onFinish = () => {
    setBtn(true);
    let body = form.getFieldsValue();
    body.id = props.value.id;
    modStudio(body).then((data) => {
      setBtn(false);
      let res = JSON.parse(data);
      if (!res.status) {
        message.success("操作成功");
        setModalVisible(false);
        props.setStudio(body)
        props.reLoad();
      } else {
        message.error(res.msg);
      }
    }).catch(() => {
      message.error("网络无法到达");
      setBtn(false);
    })
  }
  return (
    <>
      <Button type="link" onClick={showModal}>修改</Button>
      <Modal
        visible={isModalVisible}
        forceRender={true}
        onCancel={onCancel}
        footer={[
          <Button onClick={onCancel} key="close">关闭</Button>,
          <Button
            type="primary"
            form="modStaff"
            htmlType="submit"
            loading={btnLoading}
            onClick={onFinish}
            key="mod"
          >
            修改
            </Button>
        ]}
        title="修改"
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          form={form}
          name="modStaff"
        >
          <Form.Item label="演出厅名" name="name"
            rules={[{ message: "必填项", required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="座位行数" name="row"
            rules={[{ pattern: /^[1-9]\d*$/, message: "行数必须是一个整数", required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="座位列数" name="col"
            rules={[{ pattern: /^[1-9]\d*$/, message: "列数必须是一个整数", required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ message: "必选", required: true }]}>
            <Select>
              <Option value={0}>禁用</Option>
              <Option value={1}>启用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
