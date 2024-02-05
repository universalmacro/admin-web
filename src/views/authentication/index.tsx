/* eslint-disable */
import { useState, useEffect } from "react";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";

import { Modal } from "antd";
import { updateSelfPassword, basePath } from "api";

import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Card, Spin } from "antd";
import { AppDispatch } from "../../store";
import { userInfoAuth } from "features/auth/authActions";
import sha256 from "crypto-js/sha256";
import { AdminApi, Configuration, ConfigurationParameters } from "@universalmacro/core-ts-sdk";

type FieldType = {
  oldPassword?: string;
  password?: string;
};

const Authenticator = () => {
  const [image, setImage] = useState(null);
  const [secret, setSecret] = useState<any>({});
  const [validCode, setValidCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("admin-web-token") || {};
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [adminApi, setAdminApi] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      account: userInfo?.account,
      role: userInfo?.role,
    });

    if (!adminApi) {
      setAdminApi(
        new AdminApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
  }, [adminApi, userInfo?.id]);

  const onUpdatePassword = async (values: any) => {
    try {
      let updateAdminPasswordRequest = {
        oldPassword: sha256(sha256(values?.oldPassword).toString()).toString(),
        password: sha256(sha256(values?.password).toString()).toString(),
      };
      try {
        const res = await adminApi?.updateAdminSelfPassword({
          updatePasswordRequest: updateAdminPasswordRequest,
        });
        successCallback();
        dispatch(userInfoAuth({ token: userToken }));
        newForm.setFieldsValue({ oldPassword: "", password: "" });
      } catch (e) {
        errorCallback(e);
      }
    } catch (e) {}
  };

  const successCallback = (content: string = "更新密碼成功！") => {
    Modal.success({
      content: content,
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (adminApi) {
      init();
    }
  }, [adminApi]);

  const init = async () => {
    setImgLoading(true);
    try {
      const res = await adminApi?.getTotp();
      console.log("SECRET -->", res);

      if (res) {
        QRCode.toDataURL(res?.url, (err: any, image_data: any) => {
          setImage(image_data);
          setSecret(res);
        });
      }
      setImgLoading(false);
    } catch (e) {
      errorCallback(e);
    }
  };

  const getCode = () => {
    const { base32, hex } = secret;
    const code = speakeasy.totp({
      secret: hex,
      encoding: "hex",
      algorithm: "sha1",
    });

    setValidCode(code);
  };

  const onSave = async () => {
    try {
      const res = await adminApi?.updateTotp({
        updateTotpRequest: {
          url: secret?.url,
          totpCode: inputValue,
        },
      });
      console.log("RES -->", res);
      successCallback("更新成功");

      if (res) {
      }
    } catch (e) {
      errorCallback(e);
    }
  };

  const verifyCode = () => {
    // const { base32, hex } = secret;
    // const isVerified = speakeasy.totp.verify({
    //   secret: hex,
    //   encoding: "hex",
    //   token: inputValue,
    //   window: 1,
    // });
    // console.log("isVerified -->", isVerified);
    // setIsCodeValid(isVerified);
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <p className="mb-4 text-xl">更新密碼</p>
      </div>
      <div className="mt-5 flex h-full grid-cols-1 gap-5 rounded-lg bg-white p-8">
        <Form
          form={newForm}
          name="basic1"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ name: "", description: "" }}
          onFinish={onUpdatePassword}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="原密碼"
            name="oldPassword"
            rules={[{ required: true, message: "請輸入原密碼" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="新密碼"
            name="password"
            rules={[{ required: true, message: "請輸入新密碼" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              更新密碼
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="mt-12 h-full  gap-5">
        <p className="mb-4 text-xl ">Two-factor authentication</p>
      </div>

      <Card title="Two-factor methods" type="inner" className="mt-4">
        <div className="mb-4 ml-2">
          <p className="mb-2 font-bold"> Authenticator app </p>
          <p className="mb-4 text-gray-700">
            Authenticator apps and browser extensions like 1Password, Authy, Microsoft
            Authenticator, etc. generate one-time passwords that are used as a second factor to
            verify your identity when prompted during sign-in.
          </p>
        </div>

        <div className="mb-4 ml-2">
          <p className="mb-2 font-bold"> Scan the QR code </p>
          <p className="mb-4 text-gray-700">
            Use an authenticator app or browser extension to scan. Learn more about enabling 2FA.
          </p>
        </div>
        <Card style={{ width: 200, height: 200 }} bodyStyle={{ padding: "0" }}>
          <Spin tip="Loading..." spinning={imgLoading}>
            <img src={`${image}`} />
          </Spin>
        </Card>

        <div className="mb-4 ml-2 mt-2">
          <p className="text-gray-700">
            Unable to scan? You can use the to manually configure your authenticator app.
          </p>
        </div>

        <div className="mb-4 ml-2">
          <p className="mb-2 font-bold"> Verify the code from the app </p>
          <Input
            placeholder="XXXXXX"
            className="mr-4 w-[100px]"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button style={{ width: 65 }} onClick={onSave}>
            保存
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Authenticator;
