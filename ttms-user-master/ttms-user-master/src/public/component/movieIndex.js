import React, {useState, useEffect} from "react";
import {Form, Radio,message, Input,Pagination} from "antd";
import {getMovies} from '../ajax';
import {setMovieCards} from "./page_content";
import "./movieIndex.css";
import { useForm } from "antd/lib/form/Form";

export default function MovieIndex() {
    const [movies, setMovies] = useState([]);
    const [sum, setSum] = useState(0)
    const [form] = useForm();
    const [pageSize, setPageSize] = useState(24);
    const [p, setP] = useState(1);
    const get = async (p,s) => {
        let body = form.getFieldsValue();
        body.page = p;
        if(s) {
            body.pageLimit = s;
        } else {
            body.pageLimit = pageSize;
        }
        
        try {
            const data = await getMovies(body);
            
            if (!data.status && data.data) {
                setMovies(data.data.dataSource);
                setSum(data.data.sum)
            } else {
                message.error(data.msg)
            }
        } catch(err) {
            console.log(err);
            message.error("网络无法到达");
        }
        
    }
    const formChange = () => {
        get(p)
    }
    useEffect(() => {
        form.setFieldsValue({
            sortRule: "down",
            sortType: "title",
            search:""
        })
        get(1);
        // eslint-disable-next-line
    }, []); 
    const onShowSizeChange = (p,s) => {
        setPageSize(s);
        if(p === 0) {
            p = 1;
        }
        setP(p)
        get(p,s);
    }
    return (
        <div style={{width: 1200, margin: "50px auto 0"}}>
            <Form
                style={{width: 1000, margin: "auto"}}
                form={form}
                onChange={formChange}
            >
                <Form.Item name="search" label="搜索">
                    <Input.Search placeholder="输入搜索内容" onSearch={get.bind(this,p)} enterButton />
                </Form.Item>
                <Form.Item name="sortRule"> 
                    <Radio.Group defaultValue="down" >
                        <Radio value="down">降序</Radio>
                        <Radio value="up">升序</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="sortType"> 
                    <Radio.Group>
                        <Radio value="title">按名称</Radio>
                        <Radio value="rate">按评分</Radio>
                    </Radio.Group>
                </Form.Item>
                
            </Form>
            <div className="flex index-body">
                {setMovieCards(movies)}
            </div>
            <div style={{marginBottom: 50,display:"flex", justifyContent:'center'}}>
                <Pagination total={sum} onChange={onShowSizeChange} current={p} pageSize={pageSize} pageSizeOptions={[12,24,48,96]}></Pagination>
            </div>
        </div>
    )
}