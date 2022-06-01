import React, { useEffect, useState } from "react";
import { Card, Image, message, Table, Button, Form, PageHeader, Input, Modal,Pagination } from "antd";
import loading from "../public/Loading";
import { getMovies, url, getTicketByScheduleId, submitOrder,recharge } from "../public/interface"
import "./sellTicket.css"
import { AppBox } from "../public/component";
import { Link, Route } from "react-router-dom";
import { format } from "../public/module";
import { useTable } from "../public/hooks";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

const Column = Table.Column

export function SellTicket(props) {

    return (
        <AppBox>
            <Route path="/ttms/sellTicket/movie" component={ShowMovie}></Route>
            <Route path="/ttms/sellTicket/movieDetail" component={MovieDetail} />
            <Route path="/ttms/sellTicket/selectTicket" component={SelectTicket} />
        </AppBox>
    )
}

const ShowMovie = () => {
    const [data, setData] = useState([]);
    const [sum, setSum] = useState(0);
    const [form] = useForm();
    useEffect(() => {
        load();
    }, []);
    const onShowSizeChange = (p) => {
        getMovies({
            sortType: "title",
            sortRule: "up",
            page: p,
            pageLimit: 12,
            search: form.getFieldsValue().search?form.getFieldsValue().search:""
        }).then((data) => {
            if (!data.status) {
                setData(data.data.dataSource)
            } else {
                message.error(data.msg)
            }
        })
    }
    const load = (search) => {
        getMovies({
            sortType: "title",
            sortRule: "up",
            page: 1,
            pageLimit: 12,
            search: search ? search : ""
        }).then((data) => {
            if (!data.status) {
                setData(data.data.dataSource);
                setSum(data.data.sum)
            } else {
                message.error(data.msg)
            }
        })
    }
    const change = (e) => {
        if (e.target.value === "") {
            load();
        }
    }
    return (
        <>
            <Form
                layout="inline"
                className="table-form-box"
                form={form}
            >
                <Form.Item name="search" label="搜索">
                    <Input.Search placeholder="输入搜索内容" onSearch={load} enterButton onChange={change} />
                </Form.Item>
                <Form.Item>
                    <Recharge />
                </Form.Item>
            </Form>
            <div className="flex" style={{flexWrap: "wrap"}}>
                {setMovies(data)}
            </div>
            <div style={{marginBottom: 50,display:"flex", justifyContent:'center'}}>
                <Pagination total={sum} onChange={onShowSizeChange} defaultCurrent={1} showSizeChanger={false}></Pagination>
            </div>
        </>
    )
}

const MovieCard = (props) => {
    return (
        <Card
            hoverable
            style={{ width: 180, marginRight: 30, marginBottom: 30 }}
            cover={
                <Image
                    height={250}
                    src={props.cover ? props.cover : "error"}
                    preview={false}
                    fallback="data:image/png;base64,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"
                />
            }
        >
            <Card.Meta title={props.title} description="" style={{height: 40}} />
        </Card>
    )
}

function setMovies(data) {

    return data.map((value) => {
        const save = () => {
            sessionStorage.setItem("sellTicketMovie", JSON.stringify(value))
        }
        return (
            <Link to={{ pathname: `./movieDetail`, state: { movie: value } }} key={value.mid} onClick={save}>
                <MovieCard title={value.title} cover={value.cover} />
            </Link>
        )
    });
}
const MovieDetail = (props) => {
    const movie = props.location.state ? props.location.state.movie : JSON.parse(sessionStorage.getItem("sellTicketMovie"));

    return (
        <div style={{ fontSize: 16 }}>
            <PageHeader
                className="site-page-header"
                onBack={() => { window.history.back(-1) }}
                title="电影详情"
                style={{ backgroundColor: "#fff" }}
            />
            <div className="flex col-grow" style={{ justifyContent: "center", marginBottom: 30, backgroundColor: "#fff", padding: "20px 0" }}>
                <div style={{ margin: "0 0px" }}>
                    <div className="movie-title">{movie.title}</div>
                    <Image
                        width={180}
                        height={250}
                        src={movie.cover}
                        preview={true}
                        fallback="data:image/png;base64,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"
                    />
                </div>
                <div style={{ margin: "48px 100px 0", fontSize: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div><b>类型</b>：{movie.type}</div>
                    <div><b>地区</b>：{movie.area}</div>
                    <div><b>语言</b>：{movie.language}</div>
                    <div><b>时长</b>：{movie.filmlen}分钟</div>
                    <div><b>评分</b>：{movie.rate}</div>
                    <div><b>上映日期</b>：{format(new Date(movie.releaseDate), "yyyy-MM-dd")}</div>
                </div>
            </div>
            <div style={{ padding: "20px 300px", backgroundColor: "#fff", marginBottom: 30 }}>
                <div className="movie-title">演员表</div>
                <div>{movie.actor}</div>
                <div className="movie-title">简介</div>
                <div>{movie.introduction}</div>
            </div>
            <ScheduleTable movie={movie}></ScheduleTable>
        </div>
    )
}

const ScheduleTable = (props) => {
    const initFormValues = {
        movieId: props.movie.mid,
        sortName: "startTime",
        sortRule: "up",
        page: 1,
        pageLimit: 10
    };
    const table = useTable(url + "/ttms/schedule/userQuery", initFormValues, (data) => {
        if (data.dataSource) {
            data = {
                sum: 0,
                schedule: []
            };
        } else {
            data.schedule = data.schedule.map((value) => {
                if (typeof value.status === "number") {
                    value.status = value.status ? "已启用" : "未启用";
                }
                if (typeof value.startTime === "number" && typeof value.endTime === "number") {
                    value.startTime = format(new Date(value.startTime), "yyyy-MM-dd hh:mm:ss")
                    value.endTime = format(new Date(value.endTime), "yyyy-MM-dd hh:mm:ss")
                }
                return value;
            })
        }
        return data;
    });

    const save = function (value) {
        sessionStorage.setItem("sellTicketScheduleAndMovie", JSON.stringify(value))
    }

    return (
        <Table
            dataSource={table.data ? table.data.schedule : []}
            loading={{
                spinning: table.loading,
                indicator: loading,
            }}
            pagination={false}
            size="middle"
            rowKey={"scheduleId"}
        >
            <Column title="电影名称" dataIndex="movieName" />
            <Column title="演出厅" dataIndex="studioName" />
            <Column title="开始时间" dataIndex="startTime" />
            <Column title="单价" dataIndex="ticketPrice" />
            <Column title="操作" key="Action" render={(_, record) => {
                return (<Link to={{ pathname: "./selectTicket", state: { schedule: record, movie: props.movie } }}
                    onClick={save.bind(this, { schedule: record, movie: props.movie })}
                >
                    <Button>选票</Button>
                </Link>)
            }} />
        </Table>
    )
}

function SelectTicket(props) {
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
                console.log(err);
                message.error(err.msg?err.msg:"未知错误");
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
                style={{ backgroundColor: "#fff" }}
            />
            <div className="flex" style={{ justifyContent: "center", marginTop: 60 }}>
                <form
                    name="selectTicket"
                    onChange={onchange}
                    style={{ margin: "100px 100px 0" }}
                >
                    {setTicket(data)}
                </form>
                <div className="sell-ticket-information">
                    <Image
                        width={180}
                        height={250}
                        src={movie.cover}
                        preview={true}
                        fallback="data:image/png;base64,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"
                    />
                    <div className="movie-title">{movie.title}</div>
                    <div className="select-ticket-box">
                        {setSelectTicketText(selectTickets)}
                    </div>
                    <div className="tickets-price">总价格：{schedule.ticketPrice * selectTickets.length}元</div>
                    <InputUserTel tickets={selectTickets} schedule={schedule}/>
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
            res.push(<div className="flex-box" style={{ marginBottom: 5 }} key={i}>
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
    const [form] = useForm();
    const [isLoading, setLoading] = useState(false);
    const selectTickets = props.tickets;
    const handleCancel = () => {
        setModalVisible(false);
    };
    const handleClickAdd = () => {
        setModalVisible(true);
    };
    const phoneMatch = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };
    const handleFinished = () => {
        let data = form.getFieldsValue();
        setLoading(true);
        let param = {
            tickets: selectTickets.map((v) => {
                return parseInt(v.id);
            }),
            phone: data.phone,
            scheduleId: props.schedule.scheduleId
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
            >
                确认购买
            </Button>
            <Modal
                title="确认用户"
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
                </Form>
            </Modal>
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
    const phoneMatch = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };
    const handleFinished = () => {
        let data = form.getFieldsValue();
        setLoading(true);
        let param = {
            phone: data.phone,
            balance: data.money
        };
        const submit = async () => {
            try {
                let res = JSON.parse(await recharge(param))
                setLoading(false);
                if (!res.status) {
                    message.success("充值成功!");
                    setTimeout(() => {
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
                block
                type="primary"
            >
                充值
            </Button>
            <Modal
                title="确认用户"
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


