import React from 'react';
import { render } from 'react-dom';
import { ConfigProvider} from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.css';
import "./login.css"
import { PageHeader } from "./header";
import {Login} from "./login";
import {BrowserRouter as Router} from "react-router-dom";
import {HashRouter,Redirect,Route,NavLink} from "react-router-dom";
import Content from "./public/component/page_content";
import {MovieDetail} from "./public/component/movie_detail";
import {SelectTicket} from "./public/component/sell_ticket";
import MovieIndex from "./public/component/movieIndex";
import User from "./public/component/user";

moment.locale('zh-cn');
const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Route path="/" exact component={GoTo} />
        <Route path="/login" component={Login}/>
        <Route path="/index" component={Header} />
        <Route path="/index/main" component={Content} />
        <Route path="/index/movie_detail" component={MovieDetail} />
        <Route path="/index/selectTicket" component={SelectTicket} />
        <Route path="/user" component={User} />
        <Route path="/index/movieIndex" component={MovieIndex} />
      </Router>
    </ConfigProvider>
  );
};

const GoTo = () => {
  console.log('123');
  return <Login/>
}

const Header = () => {
  return (
    <>
      <PageHeader></PageHeader>
    </>
  )
};

render(<App/>, document.getElementById('root'));