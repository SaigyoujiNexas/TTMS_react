import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.less';
import { render } from 'react-dom';
import { Button, ConfigProvider, Dropdown, Layout, message, Modal, Form, Input, Menu } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import MyMenu from "./modules/menus";
import FilmsApp from "./modules/movie/movie_app";
import { BrowserRouter,HashRouter,HashRouter as Router, Route } from 'react-router-dom';
import ScheduleApp from './modules/schedule/schedule';
import { Staff } from "./modules/staff/staff";
import { SellTicket } from "./modules/sellTicket/sellTicket";
import { Hall } from "./modules/studio/studio";
import { HallDetails } from "./modules/studio/studio_details";
import login from "./modules/login/index";
import dataPresentation from "./modules/dataPresentation/index";
import ReturnTicket from "./modules/sellTicket/return";
import './index.css';
import {updatePassword} from "./modules/public/interface";
const Header = Layout.Header;

moment.locale('zh-cn');

function Page() {
  return (
      <ConfigProvider locale={zhCN}>
      <Layout className="layout">
        <Header className="header" style={{backgroundColor: "#001529"}}>
          <div className="flex-box" style={{ justifyContent: "space-between" }}>
            <div className="header-text">绿地影院</div>
            <div ><User /></div>
          </div>
        </Header>
        <Router>
          <Route path="/" exact component={login}></Route>
          <Route path="/ttms" component={Main} />
        </Router>
      </Layout>
    </ConfigProvider>
  )
}
function Main(props) {
  const [defaultSelect, setDefault] = useState("");
  props.history.listen(route => { // 监听
    setDefault(route.pathname.split("/")[2])
  });
  return (
    <HashRouter>
    <Router>
      <Layout>
        <Layout.Sider>
          <div className="sider">
            <MyMenu default={defaultSelect} />
          </div>
        </Layout.Sider>
        <Layout.Content>
          {sessionStorage.getItem("rule") === "3" ?
            (
              <>
                <Route path="/ttms/filmsQuery" component={FilmsApp} />
                <Route path="/ttms/schedule" component={ScheduleApp}></Route>
                <Route path="/ttms/hall/main" component={Hall} />
                <Route path="/ttms/hall/details" component={HallDetails} />
                <Route path="/ttms/staff" component={Staff} />
              </>
            ) : ""}
          {(sessionStorage.getItem("rule") === "1" || sessionStorage.getItem("userName") === "root") ?
            <>
              <Route path="/ttms/sellTicket" component={SellTicket} />
              <Route path="/ttms/ticket/return" component={ReturnTicket} />
            </>
            :
            ""}
          {(sessionStorage.getItem("rule") === "2" || sessionStorage.getItem("userName") === "root") ?
            <Route path="/ttms/dataPresentation" component={dataPresentation} /> : ""}
        </Layout.Content>
      </Layout>
    </Router>
    </HashRouter>
  )
}

function User() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUserName(sessionStorage.getItem("userName"))
  }, [userName, setUserName])

  const menu = <Menu>
    <Menu.Item>
      <ModPass />
    </Menu.Item>
  </Menu>

  return (
    <Dropdown overlay={menu}>
      <Button type="link">{userName}<CaretDownOutlined /></Button>
    </Dropdown>

  )
}

function ModPass(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [form] = useForm();
  const [isLoading, setLoading] = useState(false);
  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleClickAdd = () => {
    setModalVisible(true);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const handleFinished = () => {
    let data = form.getFieldsValue();
    setLoading(true);

    const submit = async () => {
      try {
        let res = JSON.parse(await updatePassword({password: data.password}))
        setLoading(false);
        if (!res.status) {
          message.success("操作成功!");
          setModalVisible(false);
        } else {
          message.error(res.msg)
        }
      } catch (err) {
        setLoading(false);
        message.error("出现异常");
        console.log(err);
      }
    }
    submit();
  }
  return (
    <>
      <Button
        onClick={handleClickAdd}
        type="link"
      >
        更改密码
          </Button>
      <Modal
        title="输入新密码"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel} key="close">取消</Button>,
          <Button form="add" type="primary" htmlType="submit" loading={isLoading} key="submit">提交</Button>
        ]}
        style={{ top: 300 }}
      >
        <Form
          autoComplete="false"
          form={form}
          {...layout}
          name="add"
          onFinish={handleFinished}
        >
          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: '密码至少为8位',
              min: 8
            }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="passwordAgain"
            rules={[{
              required: true,
              message: '两次输入密码不相同',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入密码不相同'));
              },
            }),]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

render(<HashRouter><Page/></HashRouter>, document.getElementById('root'));