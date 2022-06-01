import React, { useState, useEffect } from "react";
import { message, Button, Image, PageHeader, Modal, Steps, Divider } from "antd";
import { CheckOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { getTicketByScheduleId, submitOrder } from "../ajax";
import "./sell_ticket.css";
import { format } from "../../module/module";

const Step = Steps.Step;

export function SelectTicket(props) {
    const MS = props.location.state ? props.location.state : JSON.parse(sessionStorage.getItem("sellTicketScheduleAndMovie"));
    const schedule = MS.schedule;
    const movie = MS.movie;
    const [selectTickets, setTickets] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        const getData = async () => {
            try {
                let data = JSON.parse(await getTicketByScheduleId(schedule.scheduleId));
                if (!data.status) {
                    setData(data.data)
                }
            } catch(err) {
                message.error("网络无法到达");
                console.log(err);
            }
        }
        getData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    const getValue = () => {
        let form = document.forms["selectTicket"];
        let value = [];
        if (form["tickets"]) {
            form["tickets"].forEach(element => {
                if (element.checked) {
                    value.push({
                        id: element.value,
                        row: element.getAttribute("row"),
                        col: element.getAttribute("col")
                    });
                }
            });
        }
        return value;
    }
    const onchange = (e) => {
        setTickets(getValue());
    }
    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { window.history.back(-1) }}
                title="选座"
                style={{ backgroundColor: "#fff", width: 1040, margin: "auto" }}
            />
            <Steps style={{ width: 1000, margin: "auto", padding: "0 50px" }}>
                <Step status="finish" title="登录" />
                <Step status="finish" title="选择场次" />
                <Step status="process" title="选座" icon={<LoadingOutlined />} />
                <Step status="wait" title="付款" />
                <Step status="wait" title="取票观影" />
            </Steps>
            <div className="flex"
                style={{
                    justifyContent: "space-between",
                    border: "1px solid #eee",
                    width: 1000,
                    margin: "60px auto 0"
                }}
            >
                <form
                    name="selectTicket"
                    onChange={onchange}
                    style={{ margin: "80px 100px 0" }}
                >
                    <div className="screen"></div>
                    <div style={{ textAlign: "center", paddingLeft: 15, margin: "5px 0 20px", fontSize: 16 }}>银幕中央</div>
                    {setTicket(data)}
                </form>
                <div className="sell-ticket-information">
                    <div className="flex">
                        <Image
                            width={120}
                            height={180}
                            src={movie.cover}
                            preview={true}
                            style={{ border: "3px solid #fff" }}
                            fallback="data:image/png;base64,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"
                        />
                        <div className="movie-inform-text" style={{ marginLeft: 10, textAlign: "left", fontSize: 13 }}>
                            <div className="movie-title">{movie.title}</div>
                            <div><span>类型：</span>{movie.type.join(" ")}</div>
                            <div><span>地区：</span>{movie.area.join(" ")}</div>
                            <div><span>语言：</span>{movie.language.join(" ")}</div>
                            <div><span>开始时间:</span></div>
                            <div>{format(new Date(schedule.startTime), "MM-dd hh:mm:ss")}</div>
                        </div>
                    </div>
                    <Divider dashed />
                    <div>
                        <span>影厅：</span>
                        {schedule.studioName}
                    </div>
                    <div><span>单价：</span>{schedule.ticketPrice}元/张</div>
                    <div className="select-ticket-box">
                        {setSelectTicketText(selectTickets)}
                    </div>
                    <Divider dashed style={{ margin: "10px 0" }} />
                    <div className="tickets-price">
                        <span style={{ color: "#000" }}>总价：</span>
                        <span style={{ fontSize: 13 }}>￥</span>
                        <span style={{fontSize: 25}}>{schedule.ticketPrice * selectTickets.length}</span>
                    </div>
                    <Divider dashed style={{ margin: "10px 0" }} />
                    <InputUserTel tickets={selectTickets} schedule={schedule} />
                </div>
            </div>
        </>
    )
}

function setTicket(data) {
    if (data.tickets) {
        const row = data.rowCount;
        const col = data.colCount;
        const tickets = data.tickets;
        if (row * col !== tickets.length) {
            return [];
        }
        let res = [];
        let sum = 0;
        const setCol = (row) => {
            let colRes = [];
            for (let j = 0; j <= col; j++) {
                let type = "";
                if (row > 0 && j > 0) {
                    if (tickets[sum].ticketStatus === 1) {
                        type = "optional";
                    } else if (tickets[sum].ticketStatus === 0) {
                        type = "disable"
                    } else {
                        type = "selected"
                    }
                    colRes.push(<TicketCheckBox
                        row={row}
                        col={j}
                        id={tickets[sum].ticketId}
                        value={tickets[sum].ticketId}
                        type={type}
                        name="tickets"
                        key={tickets[sum].ticketId}
                        disabled={tickets[sum].ticketStatus === 1 ? false : true}
                    />);
                    sum++;
                } else if (!(row === 0 && j === 0)) {
                    colRes.push(<TicketCheckBox type={"num"} num={row === 0 ? j : row} name="tickets" key={row + "-" + j} />)
                } else {
                    colRes.push(<TicketCheckBox type={"num"} num="" name="tickets" key={row + "-" + j} />)
                }
            }
            return colRes
        }
        for (let i = 0; i <= row; i++) {
            res.push(<div className="flex ticket-seat-row" style={{ marginBottom: 5 }} key={i}>
                {setCol(i)}
            </div>)
        }
        return res;
    } else {
        return <div></div>
    }
}
function setSelectTicketText(data) {
    return data.map((value) => {
        return <div
            key={"text-" + value.id}
            className="ticket-select-text"
        >
            {`${value.row}行${value.col}坐`}
        </div>
    })
}


function TicketCheckBox(props) {
    return (
        <>
            <input
                className="ticket-checkbox"
                type="checkbox" name={props.name}
                hidden={true} id={props.id}
                disabled={props.disabled ? true : false}
                value={props.value}
                row={props.row}
                col={props.col}
            >
            </input>
            <label htmlFor={props.id} className={"ticket " + props.type}>
                {props.type === "num" ? <span>{props.num}</span> : props.disabled ? <CloseOutlined /> : <CheckOutlined />}
            </label>
        </>
    )
}

function InputUserTel(props) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const selectTickets = props.tickets;
    const handleCancel = () => {
        setModalVisible(false);
    };
    const handleClickAdd = () => {
        setModalVisible(true);
    };
    const handleFinished = () => {
        setLoading(true);
        let param = {
            tickets: selectTickets.map((v) => {
                return parseInt(v.id);
            }),
            scheduleId: props.schedule.scheduleId,
        };
        const submit = async () => {
            try {
                let res = JSON.parse(await submitOrder(param))
                setLoading(false);
                if (!res.status) {
                    message.success("购买成功!");
                    setTimeout(() => {
                        window.history.back(-1);
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
                block
                disabled={selectTickets.length ? false : true}
                type="primary"
            >
                确认购买
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
                您确定要购买吗？
            </Modal>
        </>
    )
}