import { message } from "antd";
import React from "react";
import {modSeatStatus} from "../public/interface"
export function Seat(props) {
  const setType = (e) => {
    if (e) {
      if (props.type === "error") {
        e.style.border = "1px solid #f5222d";
        e.style.backgroundColor = "#ff7875";
      } else if (props.type === "ok") {
        e.style.border = "1px solid #52c41a";
        e.style.backgroundColor = "#95de64";
      } else if (props.type === "warning") {
        e.style.border = "1px solid #faad14"
        e.style.backgroundColor = "#ffd666";
      }
    }
  }
  const onChangeStatus = async () => {
    if(props.data_id) {
      let newStatus = "";
      if(props.type === "ok") {
        newStatus = 0;
      } else if(props.type === "error") {
        newStatus = 1;
      }
      try {
        let res = JSON.parse(await modSeatStatus(props.data_id, newStatus))
        if(!res.status) {
          message.success("操作成功");
          props.reload();
        } else {
          message.error("操作失败:" + res.msg);
        }
      } catch(err) {
        console.log(err);
        message.error("未知错误,前往控制台查看")
      }
      
    }
  }
  return (
    <div
      className="seat-item text-center"
      ref={setType}
      onClick={props.data_id?onChangeStatus:()=>{}}
    >
      {props.type === "num" ? props.num : ""}
    </div>
  )
}