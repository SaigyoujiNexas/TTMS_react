import { useEffect, useState } from "react";
import { getTableData } from "./ajax";
import {message} from "antd"

export function useTable(url,param, fn, initData) {
    let init = {
        sum: 0,
        dataSource: []
    }
    if(initData) {
        init = initData
    }
    const [data, setData] = useState(init);
    const pageLimit = param.pageLimit?param.pageLimit:10;
    let body = param;
    let page = 1;
    const [isLoading, setLoading] = useState(true);
    const modPage = (p) => {
        if(!p) {
            p = page;
        } else {
            page = p;
        }
        setLoading(true);
        body.page = p;
        body.pageLimit = pageLimit;
        getTableData(url, body).then((data) => {
            setData(data.data);
            setLoading(false);
        }).catch((data) => {
            message.error(data.msg);
            setLoading(false);
        })
    };

    const modForm = (b) => {
        if(!b) {
            b = body;
        } else {
            body = b;
        }
        setLoading(true);
        body.page = page;
        body.pageLimit = pageLimit;
        getTableData(url, body).then((data) => {
            setData(data.data);
            setLoading(false);
        }).catch((data) => {
            message.error(data.msg);
            setLoading(false);
        })
    }
    useEffect(() => {
        modForm(body)
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    return {
        loading: isLoading,
        modForm: modForm,
        modPage: modPage,
        reLoad: modForm,
        data: fn&&data?fn(data):data
    }
}