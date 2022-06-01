import { Button, Table, Form, Select, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { addStaff, modStaff, url, resetPassword } from "../public/interface";
import { AppBox, Delete } from "../public/component";
import { useTable } from "../public/hooks";

const Column = Table.Column;
const Option = Select.Option;

export function Staff(props) {
  const [form] = useForm();
  const table = useTable(url + "/ttms/staff/get", { role: 0 }, (data) => {
    data = data.map((value) => {
      let roleStr = "";
      switch (value.role) {
        case 1:
          roleStr = "售票员";
          break;
        case 2:
          roleStr = "经理";
          break;
        case 3:
          roleStr = "管理员";
          break;
        default:
          roleStr = "不合法身份";
          break;
      }
      return {
        key: value.empId,
        username: value.username,
        role: roleStr,
        status: value.status ? "启用" : "未启用"
      }
    });
    return data;
  }, [])
  const onValuesChange = () => {
    table.modForm(form.getFieldValue());
  };
  const reset = async (user) => {
    try {
      let res = JSON.parse(await resetPassword({id: user.key}));
      if(!res.status && res.data) {
        message.success("操作成功");
      } else {
        message.error(res.msg)
      }
    } catch(err) {
      console.log(err);
      message.error("网络无法到达");
    }
    
  }

  return (
    <AppBox>
      <Form
        layout="inline"
        className="table-form-box"
        onValuesChange={onValuesChange}
        initialValues={{ role: "全部" }}
        form={form}
      >
        <Form.Item name="role" label="用户分组">
          <Select>
            <Option value="0">全部</Option>
            <Option value="3">管理员</Option>
            <Option value="2">经理</Option>
            <Option value="1">售票员</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <AddUser reLoad={table.reLoad} />
        </Form.Item>
      </Form>
      <Table
        dataSource={table.data}
        size="small"
        loading={table.loading}
      >
        <Column title="用户名" dataIndex="username" key="username" />
        <Column title="用户角色" dataIndex="role" key="role" align="center" />
        <Column title="已启用/未启用" dataIndex="status" key="status" align="center" />
        <Column title="操作" align="center" key="username"
          render={(_, record) => {
            return (
              <>
                <Modified value={record} reLoad={table.reLoad} />
                <Button type="link" onClick={reset.bind(this, record)}>重置密码</Button>
                <Delete reLoad={table.reLoad} dataID={record.key} url={url + "/ttms/staff/delete"} />
              </>
            )
          }}
        />
      </Table>
    </AppBox>
  )
}

function AddUser(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [form] = useForm();
  const [isLoading, setLoading] = useState(false);
  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleClickAdd = () => {
    setModalVisible(true);
  };
  const handleSubmit = (data) => {

  };
  const onReset = () => {
    form.resetFields();
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const handleFinished = () => {
    let data = form.getFieldsValue();
    setLoading(true);
    addStaff(data).then((data) => {
      let res = JSON.parse(data);
      setLoading(false);
      if (!res.status) {
        message.success("添加成功");
        onReset();
        setModalVisible(false);
        props.reLoad();
      } else {
        message.error("服务器异常，请检查是否用户名重复");
      }
    }).catch((e) => {
      setLoading(false);
      console.log(e);
      if (e.status === 4) {
        message.error("网络无法到达")
      }
    });
  }
  return (
    <>
      <Button
        type="primary"
        onClick={handleClickAdd}
      >
        添加新用户
      </Button>
      <Modal
        title="添加新用户"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel} key="close">取消</Button>,
          <Button type="primary" onClick={onReset} key="reset">重置</Button>,
          <Button form="add" type="primary" htmlType="submit" onClick={handleSubmit} loading={isLoading} key="submit">提交</Button>
        ]}
      >
        <Form
          autoComplete="false"
          form={form}
          {...layout}
          name="add"
          onFinish={handleFinished}
        >
          <Form.Item
            autoComplete="off"
            label="用户名"
            name="username"
            rules={[{ min: 6, required: true, message: "用户名长度必须大于6位" }]}
          >
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ min: 8, required: true, message: "密码长度必须大于8位" }]}
          >
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item label="用户身份" name="role" rules={[{ required: true, message: "必选" }]}>
            <Select>
              <Option value={3}>管理员</Option>
              <Option value={2}>经理</Option>
              <Option value={1}>售票员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
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
    let role = 0;
    switch (props.value.role) {
      case "管理员":
        role = 3;
        break;
      case "售票员":
        role = 1;
        break;
      case "经理":
        role = 2;
        break;
      default:
        role = -1;
        break;
    }
    form.setFieldsValue({
      role: role,
      status: props.value.status === "启用" ? 1 : 0,
      username: props.value.username
    })
  }, [props, form])
  const onFinish = () => {
    console.log(form.getFieldsValue())
    setBtn(true);
    modStaff(form.getFieldsValue()).then((data) => {
      setBtn(false);
      let res = JSON.parse(data);
      if (!res.status) {
        message.success("操作成功");
        setModalVisible(false);
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
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="身份" name="role">
            <Select>
              <Option value={3}>管理员</Option>
              <Option value={2}>经理</Option>
              <Option value={1}>售票员</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status">
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
