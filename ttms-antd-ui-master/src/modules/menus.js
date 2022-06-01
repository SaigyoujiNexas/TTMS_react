import React, { useEffect, useState } from "react";
import { Menu, Affix } from "antd";
import { Link } from 'react-router-dom';
// const SubMenu = Menu.SubMenu;

const PATH = {
  fimlsQuery: {
    pathname: '/ttms/filmsQuery',
    state: "fiml",
  },
  schedule: {
    pathname: "/ttms/schedule",
  },
  hall: {
    pathname: "/ttms/hall/main",
  },
  staff: {
    pathname: "/ttms/staff",
  },
  sale: {
    pathname: "/ttms/sellTicket/movie"
  },
  dataPresentation: {
    pathname: "/ttms/dataPresentation"
  }
}

export default function MyMenu(props) {
  let de = window.location.pathname.split("/")[2];
  let [d,srtd] = useState(1);
  useEffect(()=>{
    const reloadCount = sessionStorage.getItem('reloadCount');
    if(reloadCount < 2) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  },[])
  return (
    <Affix>
      <Menu mode="inline"
        theme="dark"
        defaultSelectedKeys={[de]}
      >
        {sessionStorage.getItem("rule") === "3" ? (
          <>
            <Menu.Item key="filmsQuery"><Link to={PATH.fimlsQuery}>剧目管理</Link></Menu.Item>
            <Menu.Item key="schedule"><Link to={PATH.schedule}>演出计划管理</Link></Menu.Item>
            <Menu.Item key="hall"><Link to={PATH.hall}>演出厅管理</Link></Menu.Item>
            <Menu.Item key="staff"><Link to={PATH.staff}>员工管理</Link></Menu.Item>
          </>
        ) : ""}

        {sessionStorage.getItem("rule") === "1" || sessionStorage.getItem("userName") === "root" ?
          <Menu.SubMenu key="sellTicket" title="票务管理">
            <Menu.Item><Link to={PATH.sale}>售票</Link></Menu.Item>
            <Menu.Item><Link to={"/ttms/ticket/return"}>退票</Link></Menu.Item>
          </Menu.SubMenu> :
          ""}
        {sessionStorage.getItem("rule") === "2" || sessionStorage.getItem("userName") === "root" ?
          <Menu.Item key="dataPresentation"><Link to={PATH.dataPresentation}>数据统计</Link></Menu.Item> : ""}
      </Menu>
    </Affix>

  )
}