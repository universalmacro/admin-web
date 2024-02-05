/* eslint-disable */
import { useState, useEffect } from "react";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";

const Authenticator = () => {
  const [image, setImage] = useState(null);
  const [secret, setSecret] = useState<any>({});
  const [validCode, setValidCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const secret = speakeasy.generateSecret({ name: "AuthTest" });
    console.log("SECRET -->", secret);

    // Backup codes
    const backupCodes = [];
    const hashedBackupCodes = [];
    // const randomCode = (Math.random() * 10000000000).toFixed();
    // console.log('randomCode -->', randomCode);

    for (let i = 0; i < 10; i++) {
      const randomCode = (Math.random() * 10000000000).toFixed();
      const encrypted = CryptoJS.AES.encrypt(randomCode, secret.base32).toString();
      backupCodes.push(randomCode);
      hashedBackupCodes.push(encrypted);
    }

    console.log("backupCodes ----->", backupCodes);
    console.log("hashedBackupCodes ----->", hashedBackupCodes);

    // const encrypted = CryptoJS.AES.encrypt(randomCode, secret.base32).toString();
    // console.log('encrypted -->', encrypted)
    // var bytes  = CryptoJS.AES.decrypt(encrypted, secret.base32);
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('originalText --->', originalText);

    QRCode.toDataURL(secret.otpauth_url, (err: any, image_data: any) => {
      setImage(image_data);
      setSecret(secret);
    });
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

  const verifyCode = () => {
    const { base32, hex } = secret;
    const isVerified = speakeasy.totp.verify({
      secret: hex,
      encoding: "hex",
      token: inputValue,
      window: 1,
    });

    console.log("isVerified -->", isVerified);
    setIsCodeValid(isVerified);
  };

  return (
    <div>
      <img src={`${image}`} />
      {
        <div>
          <h2>{validCode}</h2>
          <button onClick={getCode}>Get valid code</button>
        </div>
      }

      <div style={{ marginTop: 20 }}>Verify code</div>
      <input type="number" onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={verifyCode}>Verify</button>
      {isCodeValid !== null && <div>{isCodeValid ? "✅ 驗證通過" : "❌ 驗證失敗"}</div>}
    </div>
  );
};

export default Authenticator;
