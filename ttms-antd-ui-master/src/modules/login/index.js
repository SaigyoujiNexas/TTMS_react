import { Card, Col, Input, Row, Form, Button, Divider, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { userLogin } from "../public/interface";
import { AppBox } from "../public/component"

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [form] = useForm();
  const [msg, setMsg] = useState("");
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
  }
  const login = () => {
    setLoading(true);
    let userData = form.getFieldsValue();
    userLogin(userData).then((data) => {
      let res = JSON.parse(data.res);
      if (!res.status) {
        setLoading(false);
        message.success("登陆成功")
        sessionStorage.setItem("admin-token", data.token);
        sessionStorage.setItem("rule", res.data);
        sessionStorage.setItem("userName", userData.username);
        let GoTo = document.getElementById('loginin')
        GoTo.click()

      } else {
        setMsg(res.msg);
        setLoading(false);
      }
    }).catch(() => {
      message.error("网络无法到达");
      setLoading(false);
    })
  }
  return (
    <AppBox style={{ marginTop: 200 }}>
      <NavLink to={'./ttms/filmsQuery'} id="loginin"></NavLink>
      <Row>
        <Col span={16}>
          <Init />
        </Col>
        <Col span={6}>
          <Card title="登录">
            <Form {...formLayout} form={form}>
              <Form.Item label="用户名" name="username">
                <Input></Input>
              </Form.Item>
              <Form.Item label="密码" name="password">
                <Input.Password />
              </Form.Item>
              <Row>
                <Col span={20} offset={2}>
                  <div className="err-tip" style={{color :"red", marginBottom: 5}}>{msg}</div>
                </Col>
              </Row>

              <Form.Item wrapperCol={{ span: 20, offset: 2 }}>
                <Button
                  type="primary"
                  block
                  loading={isLoading}
                  onClick={login}
                >
                  登录
                 </Button>
              </Form.Item>
            </Form>
            <Divider orientation="left">提示</Divider>
            <Row><Col span={20} offset={2}>
              <p>请使用员工账户进行登录，如果忘记密码，或者需要注册账户，请联系系统管理员</p>
            </Col></Row>
          </Card>
        </Col>
      </Row>
    </AppBox>
  )
}

function Init() {
  return (
    <div className="wel"><div>欢迎进入</div><div>绿地影院管理系统</div></div>
  )
}