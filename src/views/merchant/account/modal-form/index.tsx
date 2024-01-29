import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface ModalFormProps {
  state: any;
  visible: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      account: state.account,
      password: state.password,
    });
  }, [state?.name]);

  return (
    <Modal
      open={visible}
      title="新增 Merchant"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave({ ...values });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="shortMerchantId"
          label="shortMerchantId"
          rules={[
            {
              required: true,
              message: "請輸入shortMerchantId",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="account"
          label="account"
          rules={[
            {
              required: true,
              message: "請輸入account名稱",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密碼"
          rules={[
            {
              required: true,
              message: "請輸入密碼",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
