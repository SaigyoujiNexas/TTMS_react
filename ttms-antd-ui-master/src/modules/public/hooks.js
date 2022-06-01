import { useEffect, useState } from "react"
import { strikeOut,getTableData } from "./interface";
import { message } from "antd";
class UseDelRtn {
    constructor(value) {
        this.show = value.show;
        this.close = value.close;
        this.isShow = value.isShow;
        this.loading = value.loading;
        this.del = value.del;
    }
}

/**
 * 
 * @param {string} url 
 * @returns {UseDelRtn}
 */
export function useDelete(url, key, reLoad) {
    const [isModalVisible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleOk = () => {
        setConfirmLoading(true);
        strikeOut(url, key).then((data) => {
            let res = data;
            setConfirmLoading(false);
            if (!res.status) {
                message.success("删除成功");
                setVisible(false);
                reLoad();
            }
        }).catch((err) => {
            setConfirmLoading(false);
            console.log(err)
            message.error("网络无法到达");
        });
    }
    const handleCancel = () => {
        setVisible(false);
    }

    const showModal = () => {
        setVisible(true);
    }

    return new UseDelRtn({
        show: showModal,
        close: handleCancel,
        isShow: isModalVisible,
        loading: confirmLoading,
        del: handleOk
    });
}

export function useTable(url,param, fn, initData) {
    let init = {
        sum: 0,
        dataSource: []
    }
    if(initData) {
        init = initData
    }
    const [data, setData] = useState(init);
    const pageLimit = 10;
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