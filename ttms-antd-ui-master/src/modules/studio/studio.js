import React, { useEffect, useState } from "react";
import { Button, Card, Input, Space, Form, message, Divider} from 'antd';
import { getStudioList, addStudio, url} from "../public/interface";
import Modal from "antd/lib/modal/Modal";
import { useForm } from "antd/lib/form/Form";
import { Link } from "react-router-dom";
import { Delete } from "../public/component";
export function Hall(props) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    reLoad();
  }, [])
  const reLoad = () => {
    setLoading(true);
    getStudioList().then((data) => {
      let res = JSON.parse(data);
      setLoading(false);
      if (!res.status) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    }).catch((err) => {
      setLoading(false);
      console.log(err);
      message.error("网络无法到达")
    })
  }

  return (
    <>

      <Card title={<Space size="large"><span>演出厅</span><Add reLoad={reLoad}></Add></Space>} loading={isLoading}>
        {setStudioCard(data, reLoad)}
      </Card>
    </>
  )
}

function setStudioCard(data, reLoad) {
  const gridStyle = {
    width: '10%',
    textAlign: 'center',
    cursor: "pointer",
    minWidth: "150px"
  };
  const cards = data.map((value) => {
    const path = {
      pathname: "/ttms/hall/details",
      state: value
    }
    const sum = value.row * value.col;
    return (
      <div style={{ flexDirection: "column", display: "inline-flex", marginRight: 10 }} key={value.id}>
        <Link to={path} style={{ color: "#000" }} key={"link" + value.id} onClick={() => {
          sessionStorage.setItem("studio", JSON.stringify(value));
        }}>
          <Card.Grid style={gridStyle}>
            <div>{value.name}</div>
            <Divider style={{ margin: "10px 0" }}></Divider>
            <div>总数：{sum}</div>
          </Card.Grid>
        </Link>
          <Delete
            dataID={value.id}
            reLoad={reLoad}
            url={url + "/ttms/studio/delete"}
            button={{ type: "primary" }}
          />

      </div>
    )
  });
  return cards;
}


function Add(props) {
  const [isVisible, setVisible] = useState(false);
  const [form] = useForm();
  const [isLoading, setLoading] = useState(false);
  const showModal = () => {
    setVisible(true);
  }
  const onCancel = () => {
    setVisible(false)
  }
  const onFinish = () => {
    setLoading(true);
    let data = form.getFieldsValue();
    addStudio(data).then((data) => {
      setLoading(false);
      let res = JSON.parse(data);
      if (!res.status) {
        message.success("添加成功")
        props.reLoad();
        setVisible(false);
      } else {
        message.error(res.msg);
      }
    }).catch((e) => {
      if (e.status === 4) {
        message.error(e.msg)
      }
    })
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>添加</Button>
      <Modal
        visible={isVisible}
        title="添加一个演出厅"
        footer={[
          <Button onClick={onCancel} key="close">取消</Button>,
          <Button type="primary" htmlType="submit" form="addStudio" loading={isLoading} key="submit">提交</Button>
        ]}
        onCancel={onCancel}
        width={400}
      >
        <Form
          form={form}
          wrapperCol={{ span: 16 }}
          labelCol={{ span: 6 }}
          name="addStudio"
          onFinish={onFinish}
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
        </Form>
      </Modal>
    </>
  )
}

