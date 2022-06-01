import React from "react";
import {Button, Modal} from "antd";
import {useDelete} from "./hooks";

export function Delete(props) {
    let del = useDelete(props.url, props.dataID, props.reLoad);
    let button = <Button type="link" danger onClick={del.show} style={props.style}>删除</Button>
    if(props.button) {
        button = <Button type={props.button.type} danger onClick={del.show} style={props.style}>删除</Button>
    }
    return (
        <>
            {button}
            <Modal
                centered
                title="提示"
                visible={del.isShow}
                onCancel={del.close}
                confirmLoading={del.loading}
                footer={[
                    <Button key="cance" onClick={del.close}>
                        取消
                  </Button>,
                    <Button key="submit" type="primary" loading={del.loading} onClick={del.del} danger>
                        确定
                  </Button>,
                ]}
                width={400}
            >
                确定要删除吗?此操作不可逆!
        </Modal>
        </>
    )
}
export function Circle(props) {
    const setColor = (e) => {
        if(e) {
            if(props.color) {
                e.style.backgroundColor = props.color;
            }
        }
    }
    return (
        <div className="circle" ref={setColor}>
        </div>
    )
}

export function AppBox(props) {
    const ref = (e) => {
        if(e && props.style) {
            e.style.marginTop = props.style.marginTop + "px";
        }
    }
    return (
        <div className="app-box" ref={(e) => {ref(e)}}>
            {props.children}
        </div>
    )
}