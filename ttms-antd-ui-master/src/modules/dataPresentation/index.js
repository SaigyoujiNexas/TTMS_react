import React, { useEffect, useState } from 'react';
import { Line, Column, Bar, DualAxes } from '@ant-design/charts';
import { getSalesVolume ,getAllBoxOffice, getDayBoxOffice} from "../public/interface";
import { Card, Radio,message,Statistic } from 'antd';
import {format} from "../public/module"

const Page = () => {
    return (
        <>
            <div style={{ display: "flex" }}>
                <SevenDay />
            </div>
            <div style={{ display: "flex", width: 1200, justifyContent: "space-between", marginLeft: 30 }}>
                <AllBoxOfficeTopFive />
                <TodayBoxOfficeTopFive />
            </div>
        </>
    )
};


export default Page;


function SevenDay(props) {
    const [type, setType] = useState("col");
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const get = async () => {
            try {
                let res = JSON.parse(await getSalesVolume());
                if(!res.status) {
                    let d = res.data.map((value, index) => {
                        return {
                            day: format(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * index), "MM月dd日"),
                            "销售额": value
                        }
                    });
                    setData(d.reverse());
                } else {
                    message.error(res.msg);
                }
            } catch(err) {
                console.log(err);
                message.error("网络无法到达");
            }
            
        }
        get();
    },[])

    let config = {
        data,
        height: 300,
        columnWidthRatio: 0.5,
        xField: 'day',
        yField: "销售额",
        point: {
            size: 4,
            shape: 'diamond',
        },
    };

    const toggleType = (e) => {
        setType(e.target.value)
    }
    let chart = null;
    if (type === "col") {
        chart = <Column {...config} />
    } else if (type === "line") {
        chart = <Line {...config}></Line>
    } else if (type === "colLine") {
        config = {
            data: [data, data],
            xField: 'day',
            yField: ['销售额', '销售额'],
            height: 300,
            columnWidthRatio: 0.5,
            geometryOptions: [
                { geometry: 'column' },
                {
                    geometry: 'line',
                    lineStyle: { lineWidth: 3 },
                },
            ],
        };
        chart = <DualAxes {...config} />
    }
    let cha = 0;
    if(data.length) {
        cha = data[data.length-1]["销售额"]-data[data.length-2]["销售额"];
        if(cha >= 0) {
            cha = "+" + cha;
        }
    }

    return (
        <Card title="近三十日销售额统计图" style={{ margin: "30px", width: 1200 }}>
        <Statistic title="今日销售额" value={data.length?data[data.length-1]["销售额"]:""} precision={2} />
        <Statistic title="较昨日" value={cha} precision={2} />
            <div style={{ display: 'flex', justifyContent: "right", marginBottom: 20 }}>
                <Radio.Group defaultValue="col" buttonStyle="solid" onChange={toggleType}>
                    <Radio.Button value="col">条形</Radio.Button>
                    <Radio.Button value="line">折线</Radio.Button>
                    <Radio.Button value="colLine">混合</Radio.Button>
                </Radio.Group>
            </div>

            {chart}
        </Card>
    );
}

function AllBoxOfficeTopFive() {
    const [data,setData] = useState([]);
    const get = async (body) => {
        try {
            let res = JSON.parse(await getAllBoxOffice(body));
            if(!res.status) {
                let d = res.data.map((value) => {
                    return {
                        name: value.movieName,
                        "票房": value.boxOffice
                    }
                });
                if(d.length < 5) {
                    while(d.length < 5) {
                        d.push({
                            name: "下无",
                            "票房": 0
                        })
                    }
                }
                setData(d)
            }
        } catch(err) {
            message.error("网络无法到达");
            console.log(err);
        }
    }

    useEffect(() => {
        let init = {
            sortType: "down",
            page: 1,
            pageLimit: 5
        }
        
        get(init);
    }, [])

    const change = (e) => {
        get({
            page: 1,
            pageLimit: 5,
            sortType: e.target.value
        })
    }


    const config = {
        data,
        height: 250,
        xField: '票房',
        yField: "name",
        columnWidthRatio: 0.5,
        point: {
            size: 5,
            shape: 'diamond',
        },
        style: {
            lineWidth: 2
        }
    };

    return (
        <Card title="总票房TOP5" style={{ margin: "30px 0", width: 550 }}>
            <div style={{ display: 'flex', justifyContent: "right", marginBottom: 20 }}>
                <Radio.Group defaultValue="down" buttonStyle="solid" onChange={change}>
                    <Radio.Button value="down">最高</Radio.Button>
                    <Radio.Button value="up">最低</Radio.Button>
                </Radio.Group>
            </div>
            <Bar {...config} />
        </Card>
    )
}


function TodayBoxOfficeTopFive() {
    const [data,setData] = useState([]);
    const get = async (body) => {
        try {
            let res = JSON.parse(await getDayBoxOffice(body));
            if(!res.status) {
                let d = res.data.map((value) => {
                    return {
                        name: value.movieName,
                        "票房": value.boxOffice
                    }
                });
                if(d.length < 5) {
                    while(d.length < 5) {
                        d.push({
                            name: "下无",
                            "票房": 0
                        })
                    }
                }
                setData(d)
            }
        } catch(err) {
            message.error("网络无法到达");
            console.log(err);
        }
    }

    useEffect(() => {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        let init = {
            sortType: "down",
            page: 1,
            pageLimit: 5,
            time: today.getTime()
        }
        get(init);
    }, [])

    const change = (e) => {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        let init = {
            sortType: e.target.value,
            page: 1,
            pageLimit: 5,
            time: today.getTime()
        }
        get(init)
    }

    const config = {
        data,
        height: 250,
        xField: '票房',
        yField: "name",
        columnWidthRatio: 0.5,
        point: {
            size: 5,
            shape: 'diamond',
        },
        style: {
            lineWidth: 2
        }
    };

    return (
        <Card title="今日总票房TOP5" style={{ margin: "30px 0", width: 550 }}>
            <div style={{ display: 'flex', justifyContent: "right", marginBottom: 20 }}>
                <Radio.Group defaultValue="down" buttonStyle="solid" onChange={change}>
                    <Radio.Button value="down">最高</Radio.Button>
                    <Radio.Button value="up">最低</Radio.Button>
                </Radio.Group>
            </div>
            <Bar {...config} />
        </Card>
    )
}