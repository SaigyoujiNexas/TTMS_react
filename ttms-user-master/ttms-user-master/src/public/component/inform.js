import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Input, Form, Divider, Radio, message, Upload ,Modal} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { getUserInform, modUserInform, baseurl,recharge } from "../ajax";
import "./inform.css";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import ImgCrop from 'antd-img-crop';

export default function UserInform() {
    const [data, setData] = useState({})
    const load = async () => {
        let token = sessionStorage.getItem("user-token") || localStorage.getItem("user-token")
        let res = JSON.parse(await getUserInform(token));
        if (!res.status) {
            setData(res.data)
        }
    }
    useEffect(() => {
        load();
    }, [])
    return (
        <>
            <Basic data={data} load={load} />
            <Sensitive data={data} load={load} />
        </>
    )
}

function Basic(props) {
    const [isForm, setIsForm] = useState(false);
    // eslint-disable-next-line
    const [form] = useForm();
    const data = props.data;

    const toggleForm = () => {
        setIsForm(true);
    }
    const toggleUser = () => {
        setIsForm(false);
    }
    const layout = {
        labelCol: { span: 2, offset: 0 },
        wrapperCol: { span: 6 },
    };
    const finishedMod = async () => {
        let res = JSON.parse(await modUserInform(form.getFieldsValue()));
        if (!res.status && res.data) {
            message.success("修改成功！");
            props.load();
            setIsForm(false);
        }
    }

    const input = (
        <Form
            {...layout}
            size="small"
            form={form}
            onFinish={finishedMod}
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '用户名不得低于六位', min: 6 }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="年龄"
                name="age"
                rules={[{ required: true, message: '年龄只能是正整数', pattern: /^[1-9]\d*|0$/ }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="性别"
                name="gender"
            >
                <Radio.Group>
                    <Radio value={"0"}>男</Radio>
                    <Radio value={"1"}>女</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: '请输入正确的邮箱', pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="介绍"
                name="introduce"
                rules={[{message: '长度不能大于50个字符', max: 50 }]}
            >
                <TextArea autoSize></TextArea>
            </Form.Item>
            <Form.Item>
                <Button onClick={toggleUser} type="link" style={{marginLeft: 80}}>取消</Button>
                <Button type="link" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
            </Form.Item>
        </Form>
    )
    const user = (
        <>
            <div className="group">
                <span>用户名：</span>
                <span>{data.username}</span>
            </div>
            <div className="group">
                <span>年龄：</span>
                <span>{data.age}</span>
            </div>
            <div className="group">
                <span>性别：</span>
                <span>{data.gender==="1" ? "女" : "男"}</span>
            </div>
            <div className="group">
                <span>邮箱：</span>
                <span>{data.email}</span>
            </div>
            <div className="group">
                <span>个人介绍：</span>
                <span>{data.introduce}</span>
            </div>
            <Button type="link" onClick={toggleForm} style={{marginLeft: -16}}>更改</Button>
        </>
    )
    form.setFieldsValue(data)
    return (
        <>
            <Card title={<span style={{ fontSize: 20, color: "#f00056" }}>基本信息</span>} className="inform-card">
                <div className="group">
                    <span>头像：</span>
                    <Avatar size={64} icon={<UserOutlined />} src={data.portrait} />
                    <UpCover reload={props.load}/>
                </div>
                <Divider></Divider>
                {isForm ? input : user}
            </Card>
        </>
    )
}

function floatFloor(num, n){
    var m = Math.pow(10,n);
    return Math.floor(num*m)/m;
}

function Sensitive(props) {
    return (
        <Card title={<span style={{ fontSize: 20, color: "#f00056" }}>敏感信息</span>} className="inform-card">
            <div className="group">
                <span>电话号：</span>
                <span>{props.data.phone}</span>
            </div>
            <div className="group">
                <span>账户余额：</span>
                <span>{floatFloor(props.data.balance, 2)}</span>
                <Recharge reload={props.load}/>
            </div>
        </Card>
    )
}

function UpCover(props) {
    const [loading] = useState(false);
    const uploadButton = <Button type="link" loading={loading}>更改</Button>

    return (
        <>
            <ImgCrop rotate shape="round">
                <Upload
                    action={baseurl + "/ttms/user/inform/updatePortrait"}
                    headers={{
                        "token": sessionStorage.getItem("user-token") || localStorage.getItem("user-token")
                    }}
                    showUploadList={false}
                    name="file"
                    maxCount={1}
                    onChange={(e) => {
                        if (e.file.status === "done") {
                            if(e.file.response.data) {
                                message.success("上传成功");
                                props.reload();
                            } else {
                                message.error(e.file.response.msg)
                            }
                          }
                    }}
                >
                    {uploadButton}
                </Upload>
            </ImgCrop>
        </>
    )
}

function Recharge(props) {
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
        let param = {
            balance: data.money
        };
        const submit = async () => {
            try {
                let res = JSON.parse(await recharge(param))
                setLoading(false);
                if (!res.status) {
                    message.success("充值成功!");
                    setTimeout(() => {
                        props.reload()
                        setModalVisible(false)
                    }, 1000)

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
                充值
            </Button>
            <Modal
                title="确认金额"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel} key="close">取消</Button>,
                    <Button form="add" type="primary" htmlType="submit" loading={isLoading} key="submit">提交</Button>
                ]}
                style={{top: 300}}
            >
                <Form
                    autoComplete="false"
                    form={form}
                    {...layout}
                    name="add"
                    onFinish={handleFinished}
                >
                    <Form.Item
                        label="金额"
                        name="money"
                        rules={[{
                            pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
                            required: true,
                            message: '金额必须是正数字且小数位数不能超过2位'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

