import React, { useState } from "react"
import { Button, Modal, Form, Input, Upload, DatePicker, message } from "antd"
import { insertNewFilm, url } from "../public/interface";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
const TextArea = Input.TextArea;

export const InputFilm = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const [form] = useForm();
  const handleOk = () => {
    setConfirmLoading(true);
    console.log(form.getFieldsValue())
    let data = form.getFieldsValue();
    insertNewFilm(data).then((data) => {
      let res = JSON.parse(data)
      setConfirmLoading(false);
      if (!res.status) {
        message.success("添加成功");
        setIsModalVisible(false);
        props.reLoad();
      } else {
        message.error(res.meg);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const onDateChange = (e) => {
    console.log(e)
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加
        </Button>
      <Modal
        title="添加一个电影"
        visible={isModalVisible}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        footer={[
          <Button key="cance" onClick={handleCancel}>
            取消
            </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="movieForm" loading={confirmLoading}>
            提交
            </Button>,
        ]}
        width={600}
      >
        <Form
          {...layout}
          form={form}
          onFinish={handleOk}
          name="movieForm"
        >
          <Form.Item label="电影标题" name="title" rules={[{required: true, message:"不能为空"}]}>
            <Input />
          </Form.Item>
          <Form.Item label="封面" name="cover" rules={[{required: true, message:"不能为空"}]}>
            <UpCover form={form} />
          </Form.Item>
          <Form.Item label="演员表" name="actor" rules={[{required: true, message:"不能为空"}]} >
            <Input />
          </Form.Item>
          <Form.Item label="电影类型" name="type" rules={[{required: true, message:"不能为空"}]} >
            <Input />
          </Form.Item>
          <Form.Item label="制片地区" name="area" rules={[{required: true, message:"不能为空"}]} >
            <Input />
          </Form.Item>
          <Form.Item label="语言" name="language" rules={[{required: true, message:"不能为空"}]}>
            <Input />
          </Form.Item>
          <Form.Item label="上映日期" name="releaseDate" rules={[{required: true, message:"不能为空"}]}>
            <DatePicker placeholder="选择日期" onChange={onDateChange} />
          </Form.Item>
          <Form.Item label="评分" name="rate" rules={[{required: true, message:"不能为空"}]}>
            <Input />
          </Form.Item>
          <Form.Item label="片长" name="filmlen" rules={[{required: true, message:"不能为空"}]}>
            <Input addonAfter="分钟" />
          </Form.Item>
          <Form.Item label="简介" name="introduction" rules={[{required: true, message:"不能为空"}]}>
            <TextArea autoSize />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};


function UpCover(props) {
  const [loading] = useState(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        action={url + "/ttms/movie/upload-cover"}
        name="cover"
        listType="picture-card"
        maxCount={1}
        onChange={(e) => {
          console.log(e)
          if (e.file.status === "done") {
            console.log(e.file.response.data)
            props.form.setFieldsValue({
              cover: e.file.response.data
            })
          }
        }}
      >
        {uploadButton}
      </Upload>
    </>
  )
}