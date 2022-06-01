import React from "react";
import { Button, Image, Table } from "antd";
import { useTable } from "../hooks";
import "./movie_detail.css";
import { format } from "../../module/module"
import { baseurl } from "../ajax";
import { Link } from "react-router-dom"

const Column = Table.Column;

export function MovieDetail(props) {
    const movie = props.location.state ? props.location.state.movie : JSON.parse(sessionStorage.getItem("click-movie"));
    return (
        <>
            <div className="movie-detail-box">
                <div className="filter">
                    <div className="movie-bg"></div>
                </div>
                <div className="inform-box flex">
                    <Image
                        width={200}
                        height={280}
                        src={movie.cover ? movie.cover : "error"}
                        style={{ border: "3px solid #fff", marginRight: 20, boxShadow: "0 10px 10px 0 #eee" }}
                        fallback="data:image/png;base64,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"
                    />
                    <div className="movie-detail-inform" style={{ fontSize: 16, position: "relative" }}>
                        <div className="movie-detail-title">{movie.title}</div>
                        <div>{movie.type.join(" ")}</div>
                        <div>
                            <span>{movie.area.join(" ")}</span>
                            <span>/</span>
                            <span>{movie.filmlen}分钟</span>
                        </div>
                        <div>{format(new Date(movie.releaseDate), "yyyy-MM-dd")}上映</div>
                        <a href={"#schedules"}><Button block type="primary" style={{ position: "absolute", top: 200 }}>特惠购票</Button></a>
                    </div>
                </div>
            </div>
            <div style={{width: 1000, margin: "auto"}}>
                <div
                    style={{
                        borderBottom: "3px solid tomato",
                        margin: "0 auto 20px",
                        fontSize: 20,
                        color: "tomato"
                    }}
                >
                    剧情介绍
            </div>
                <div>{movie.introduction}</div>
            </div>

            <ScheduleList movie={movie} />
        </>
    )
}


function ScheduleList(props) {
    return (
        <div style={{ width: 1000, margin: "100px auto 200px" }}>
            <ScheduleTable movie={props.movie} />
        </div>
    )
}

const ScheduleTable = (props) => {
    const initFormValues = {
        movieId: props.movie.mid,
        sortName: "startTime",
        sortRule: "up",
        page: 1,
        pageLimit: 999
    };
    const table = useTable(baseurl + "/ttms/schedule/userQuery", initFormValues, (data) => {
        if (data.dataSource) {
            data = {
                sum: 0,
                schedule: []
            };
        } else {
            data.schedule = data.schedule.map((value) => {
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
        if (sessionStorage.getItem("user-token") || localStorage.getItem("user-token")) {
            sessionStorage.setItem("sellTicketScheduleAndMovie", JSON.stringify(value))
        } else {
            sessionStorage.setItem("back", window.location.pathname);
            window.location = "../login";
        }
    }

    return (
        <Table
            dataSource={table.data ? table.data.schedule : []}
            loading={table.loading}
            pagination={false}
            size="middle"
            rowKey={"scheduleId"}
            id="schedules"
        >
            <Column title="电影名称" dataIndex="movieName" />
            <Column title="开始时间" dataIndex="startTime" />
            <Column title="单价" dataIndex="ticketPrice" />
            <Column title="" key="Action" align="right" render={(_, record) => {
                return (<Link to={{ pathname: "./selectTicket", state: { schedule: record, movie: props.movie } }}
                    onClick={save.bind(this, { schedule: record, movie: props.movie })}
                >
                    <Button type="primary" size="middle" >选票</Button>
                </Link>)
            }} />
        </Table>
    )
}