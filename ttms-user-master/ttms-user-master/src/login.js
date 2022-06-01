import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Layout, Form, Input, Button, Checkbox, Card, message } from 'antd';
import login_img from "./image/login.png";
import { getCode, judgeCode } from "./public/ajax";
import { useForm } from "antd/lib/form/Form";

const Header = Layout.Header;
export const Login = (props) => {
    return (
        <div className="full-height">
            <Header>
                <div className="logo">
                    绿地影院
                </div>
            </Header>
            <div className="login-content">
                <div className="login-img">
                <img src={login_img} style={{width:'420px',height:'250px'}} alt="图片没了"></img>
                </div>
                <Card title="登录" style={{ width: 500, margin: "auto" }}>
                    <LoginForm></LoginForm>
                </Card>
            </div>
        </div>
    )
}

const layout = {
    labelCol: { span: 4, offset: 1 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 14 },
};
const phoneMatch = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|19[0|1|2|3|5|6|7|8|9])\d{8}$/;

const LoginForm = () => {
    const [form] = useForm();
    const [waitTime, setWait] = useState(0);
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState({
        data: true
    });
    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            setLoading(true);
            let response = await judgeCode(values);
            setLoading(false);
            if (response.res.data) {
                if (values) {
                    localStorage.setItem("user-token", response.headers.get("token"));
                } else {
                    sessionStorage.setItem("user-token", response.headers.get("token"));
                }
                message.success("登录成功");
                setTimeout(() => {
                    if(sessionStorage.getItem("back")) {
                        let back = sessionStorage.getItem("back")
                        sessionStorage.removeItem("back");
                        window.location = back;
                    } else {
                        // window.location = "../index/main";
                        let GoTo = document.getElementById('loginin')
                        GoTo.click()
                    }
                }, 1000);
            } else {
                console.log(response.res);
                setRes(response.res);
            }
        } catch (err) {
            console.log(err);
            message.error('出现异常');
            setLoading(false);
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setRes({data: false})
    };

    const onClickCode = async () => {
        try {
            let phone = form.getFieldValue("phone");
            if (phone && phone.match(phoneMatch)) {
                let res = await getCode(phone);
                if (res.data && !res.status) {
                    setWait(true);
                    let timer = setInterval(() => {
                        setWait((waitTime) => {
                            if (waitTime !== 60) {
                                setWait(waitTime + 1);
                            } else {
                                clearInterval(timer);
                            }
                        });
                    }, 1000);
                } else {
                    setRes(res);
                }
            } else {
                message.warning("请输入正确的手机号")
            }
        } catch (err) {
            message.error("出现异常");
            console.log(err);
        }
    }

    const codeChanged = () => {
        setRes({
            data: true
        })
    }

    return (
        
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
        >
             <NavLink to={'../index/main'} id="loginin"></NavLink>
            <Form.Item
                label="手机号"
                name="phone"
                rules={[{
                    pattern: phoneMatch,
                    required: true,
                    message: '请输入正确的手机号'
                }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                style={{
                    marginBottom: 10
                }}
                label="验证码"
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
                validateStatus={res.data ? "success" : "error"}
                help={res.msg}
            >
                <Input
                    onChange={codeChanged}
                    suffix={
                        <Button
                            type="link"
                            size="small"
                            onClick={onClickCode}
                            disabled={waitTime}
                        >
                            {!waitTime ? "获取验证码" : `${60 - waitTime}秒后可重新获取`}
                        </Button>
                    } />
            </Form.Item>
            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>7天之内免登录</Checkbox>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" shape="round" htmlType="submit" block loading={loading}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};
