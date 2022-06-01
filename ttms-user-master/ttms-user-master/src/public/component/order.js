import { Card, Menu, Collapse, Button, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getUserOrders, returnOrder } from "../ajax";
import { format } from "../../module/module";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import "./order.css"


const { Panel } = Collapse;

export default function Order() {
    const [showType, setType] = useState("hot");
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const load = async () => {
        setLoading(true);
        let res = JSON.parse(await getUserOrders());
        setLoading(false);
        if (!res.status && res.data) {
            setData(res.data);
        }
    }
    useEffect(() => {
        load()
    }, [])

    const menuChanged = (e) => {
        setType(e.key);
    }
    return (
        <div>
            <Menu defaultSelectedKeys="hot" mode="horizontal" style={{ marginBottom: 20 }} onClick={menuChanged}>
                <Menu.Item key="hot">近期订单</Menu.Item>
                <Menu.Item key="long-time">历史订单</Menu.Item>
                <Menu.Item key="return">已退款</Menu.Item>
            </Menu>
            <div style={{position: "relative"}}>
                {setOrders(data, showType, load)}
                {isLoading ?
                    (
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 300,
                            backgroundColor: "#ffffff77",
                            width: "100%"
                        }}>
                            <Loading3QuartersOutlined spin style={{ fontSize: 30, color: "tomato", position: "absolute", top: 50}} />
                        </div>
                    )
                    : ""}
            </div>

        </div>
    )
}

function setOrders(data, showType, load) {
    console.log(data);
    let res = [];
    let status = 0;
    if (showType === "hot") {
        status = 1;
    } else if (showType === "long-time") {
        status = 0;
    } else if (showType === "return") {
        status = -1;
    }
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let value = data[i];
            if (value.orderStatus === status) {
                res.push(<OrderCard order={value} key={value.orderId} reload={load} />)
            }
        };
    }

    return res;
}

function OrderCard(props) {
    const order = props.order;
    const setTickets = (tickets) => {
        return tickets.map((value, index) => {
            return (
                <div style={{ marginLeft: 5 }} key={value.row + "-" + value.col + "-" + index}>
                    <div>座位：{value.row}行{value.col}座</div>
                </div>
            )
        })
    }
    return (
        <Card
            title={<div className="tomato">订单号：{order.orderId}</div>}
            style={{ marginBottom: 20 }}
        >
            <div style={{ marginLeft: 10 }}>
                <div>支付时间：{format(new Date(order.payTime), "yyyy年MM月dd日 hh:mm:ss")}</div>
                <div style={{ backgroundColor: "#fff", marginBottom: 20 }}>商品名称：绿地观影票</div>
            </div>

            <Collapse style={{ border: "none", backgroundColor: "#fff" }}>

                <Panel header="商品描述" style={{ backgroundColor: "#FFF", border: "none", marginLeft: -10 }}>
                    <div style={{ marginLeft: 5 }}>
                        <div>商品数量：{order.tickets.length}</div>
                        <div>电影名称：{order.movieName}</div>
                        <div>演出厅：{order.studioName}</div>
                        <div>演出时间：{format(new Date(order.startTime), "yyyy年MM月dd日 hh:mm:ss")}</div>
                        <div>结束时间：{format(new Date(order.endTime), "yyyy年MM月dd日 hh:mm:ss")}</div>
                    </div>
                </Panel>
                <Panel header="票" style={{ backgroundColor: "#FFF", border: "none", marginLeft: -10 }}>
                    {setTickets(order.tickets)}
                </Panel>
            </Collapse>
            <div style={{ textAlign: "right" }}>总价格：<span className="tomato" style={{ fontSize: 20 }}>￥{order.price}</span></div>
            <div style={{ display: "flex", justifyContent:"flex-end", marginTop: 10 }}>
                {order.orderStatus === 1 ? <ReturnModal order={order} reload={props.reload} /> : ""}
            </div>
        </Card>
    )
}


function ReturnModal(props) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const handleCancel = () => {
        setModalVisible(false);
    };
    const handleClickAdd = () => {
        setModalVisible(true);
    };
    const handleFinished = () => {
        setLoading(true);
        let param = {
            orderId: props.order.orderId
        };
        const submit = async () => {
            try {
                let res = JSON.parse(await returnOrder(param))
                setLoading(false);
                if (!res.status) {
                    message.success("退款成功!");
                    setModalVisible(false)
                    props.reload();
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
                type="primary"
            >
                退款
            </Button>
            <Modal
                title="确认"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel} key="close">取消</Button>,
                    <Button form="add" type="primary" loading={isLoading} key="submit" onClick={handleFinished}>确定</Button>
                ]}
                style={{ top: 300, width: 400 }}
            >
                您确定要退款吗？
            </Modal>
        </>
    )
}