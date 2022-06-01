import 'antd/dist/antd.less';
import "./header.css";
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, message, Dropdown } from 'antd';
import { UserOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { testToken, getUserInform } from "./public/ajax";


const Header = Layout.Header;
let loginPath = {
  pathname: "/login",
  state: {
    isgoto: false
  }
}
export const PageHeader = () => {
  const [isLogin, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    let token = localStorage.getItem("user-token") || sessionStorage.getItem("user-token");
    const test = async () => {
      if (token) {
        try {
          let resText = await testToken(token);
          let res = JSON.parse(resText);
          if (res.status === 0 && res.data) {
            setLogin(true);
            let user = JSON.parse(await getUserInform(token));
            if (!user.status && user.data) {
              setUserData(user.data)
            } else {
              message.error(user.msg)
            }
          } else {
            if (localStorage.getItem("user-token")) {
              localStorage.removeItem("user-token");
            } else {
              sessionStorage.removeItem("user-token");
            }
          }
        } catch (err) {
          console.log(err);
          message.error("网络无法到达");
        }
      }
    }
    test();
  }, []);
  const logout = () => {
    if (sessionStorage.getItem("user-token")) {
      sessionStorage.removeItem("user-token");
    }
    if (localStorage.getItem("user-token")) {
      localStorage.removeItem("user-token");
    }
  }
  const menu = (
    <Menu defaultSelectedKeys={[""]}>
      <Menu.Item key="0" style={{ color: "tomato", textAlign: "center" }}>
        <Link to="/user/inform">
          个人信息
        </Link>
      </Menu.Item>
      <Menu.Item key="1" style={{ color: "tomato", textAlign: "center" }}>
        <Link to="/user/inform" onClick={logout}>
          退出登录
          </Link>
      </Menu.Item>
    </Menu>
  );

  let user = (
    <Link to={loginPath}>
      <Avatar size="large" icon={<UserOutlined />} />
      {" 登录"}
    </Link>
  )
  if (isLogin) {
    user = (
      <Dropdown overlay={menu} trigger={['click']}>
        <div style={{ cursor: "pointer" }}>
          <Avatar size="large" icon={<UserOutlined />} src={userData.portrait} />
          <span style={{ marginLeft: 10, color: "#fff" }}>
            <span>{userData.username}</span>
            <span style={{ position: "relative", top: 3 }}>
              <CaretDownOutlined style={{ paddingTop: 9 }} />
            </span>
          </span>
        </div>

      </Dropdown>
    )
  }

  if (window.location.pathname === "/index") {
    window.location = "./index/main"
    return <></>
  } else {
    return (
      <Header style={{ width: '100%', display: "flex", justifyContent: "space-between", padding: 0 }}>
        <div className="flex header-content">
          <div className="flex">
            <div className="logo">绿地影院</div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1"><Link to="./main">首页</Link></Menu.Item>
              <Menu.Item key="2"><Link to="./movieIndex">电影索引</Link></Menu.Item>
            </Menu>
          </div>
          <div className="user">
            {user}
          </div>
        </div>
      </Header>
    )
  }
}