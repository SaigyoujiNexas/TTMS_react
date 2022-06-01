import React from "react";
import { Layout, Menu } from "antd";
import { Link, Route } from "react-router-dom";
import Inform from "./inform";
import Order from "./order";
import "./user.css"

const Header = Layout.Header;
export default function Page() {
    return (
        <>
            <Head />
            <Body />
        </>
    )
}


function Head(props) {
    return (
        <Header style={{ width: '100%', display: "flex", justifyContent: "space-between", padding: 0 }}>
            <div className="flex header-content">
                <div className="flex" style={{ width: 400 }}>
                    <div className="logo">绿地影院</div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys="1" style={{ flexGrow: 1 }}>
                        <Menu.Item key="1"><Link to="../index/main">首页</Link></Menu.Item>
                    </Menu>
                </div>
            </div>
        </Header>
    )
}

function Body() {
    return (
        <div className="flex" style={{ width: 1200, margin: "30px auto", borderTop: "3px solid tomato" }}>
            <SiderMenu />
            <div style={{ flexGrow: 1 }}>
                <Route path="/user/inform" component={Inform}></Route>
                <Route path="/user/order" component={Order}></Route>
            </div>
        </div>
    )
}

function SiderMenu() {
    let url = window.location.pathname.split("/")[2];
    return (
        <Layout.Sider style={{backgroundColor: "#fff", marginRight: 20, paddingBottom: 20}}>
            <Menu
                className="user-menu"
                mode="inline"
                defaultSelectedKeys={[url]}
            >
                <Menu.Item key={"inform"}><Link to="./inform">个人信息</Link></Menu.Item>
                <Menu.Item key={"order"}><Link to="./order">我的订单</Link></Menu.Item>
            </Menu>
        </Layout.Sider>
    )
}