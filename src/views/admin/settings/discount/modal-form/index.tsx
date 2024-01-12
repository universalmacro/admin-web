import { useEffect, useState } from 'react';
import { Modal, Form, Input, Slider, Col, InputNumber, Row } from 'antd';
import { Discount } from 'types/restaurant';

interface DiscountModalFormProps {
  state: Discount;
  visible: boolean;
  onSave: (discount: Discount) => void;
  onCancel: () => void;
}

const DiscountModalForm: React.FC<DiscountModalFormProps> = ({ state, visible, onSave, onCancel }: any) => {
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("useEffect", state);
    form.setFieldsValue({
      id: state.id,
      label: state.label,
      offset: state.offset,
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
          name="label"
          label="折扣名稱"
          rules={[
            {
              required: true,
              message: '請輸入折扣名稱',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="折扣" name="offset">

          <Slider
            min={-100}
            max={100}
            onChange={onChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
          />
        </Form.Item>
        <Form.Item label="折扣" name="offset">
          <InputNumber
            min={-100}
            max={100}
            style={{ margin: '0 16px' }}
            value={inputValue}
            onChange={onChange}
          />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default DiscountModalForm;