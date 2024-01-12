import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Col, InputNumber, Row } from 'antd';
import { Printer } from 'types/restaurant';

interface PrinterModalFormProps {
  state: Printer;
  visible: boolean;
  onSave: (printer: Printer) => void;
  onCancel: () => void;
}

const PrinterModalForm: React.FC<PrinterModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("PrinterModalForm-useEffect", state);
    form.setFieldsValue({
      id: state.id,
      name: state.name,
      sn: state.sn,
      description: state.description,
      model: state.model,
      type: state.type,
    })
  }, [state?.id]);

  const onChange = (newValue: number) => {
    setInputValue(newValue);
  };


  return (
    <Modal
      open={visible}
      title="新增/编辑折扣"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onSave({ ...state, ...values, offset: inputValue });
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="name"
          label="打印機名稱"
          rules={[
            {
              required: true,
              message: '請輸入折扣名稱',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sn"
          label="SN編號"
          rules={[
            {
              required: true,
              message: '請輸入SN編號',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
        >
          <Input />
        </Form.Item>
        <Form.Item name="type" label="模型">
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            options={[{ value: 'BILL', label: '帳單' }, { value: 'KITCHEN', label: '廚房' }]}
          />
        </Form.Item>
        <Form.Item name="model" label="型號">
          <Select
            defaultValue="58mm"
            style={{ width: 120 }}
            options={[{ value: '58mm', label: '58mm' }, { value: '88mm', label: '88mm' }]}
          />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default PrinterModalForm;