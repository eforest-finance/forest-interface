import Banner from 'assets/images/v2/free_banner.png';
import Image from 'next/image';
import Button from 'baseComponents/Button';

import UploadSingle from 'pagesComponents/CreateItemV2/components/Upload/UploadSingle';
import { ISingleFile } from 'store/reducer/create/item';
import { ChangeEvent, useCallback, useState } from 'react';
import Input, { TextArea } from 'baseComponents/Input';

import styles from './style.module.css';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { DoubleCheck, Creating, SuccessModal } from '../Modals';

const Activity = () => {
  const [file, setFile] = useState<ISingleFile>();
  const { isLogin, login } = useCheckLoginAndToken();
  const [err, setErr] = useState<string>();
  const [name, setName] = useState<string>();
  const checkValid = Boolean(!err?.length && file && name?.length);
  console.log('checkValid:', checkValid);

  return (
    <div className="w-full h-full relative">
      <Image className="z-0 w-full h-fit object-none" src={Banner} alt="" />
      <div className="px-[16px]">
        <div className="step1">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 1
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Login</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary">
            Sign up or log in to your account through Google, Telegram, email, etc.
          </div>
          <Button
            disabled={isLogin}
            type="primary"
            className="mt-[16px] w-full h-[48px]"
            onClick={() => {
              if (!isLogin) {
                login();
              }
            }}>
            {!isLogin ? 'Log In' : 'Logged In'}
          </Button>
        </div>
        <div className="step2 mt-[32px]">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 2
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Upload an image</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary">
            Upload the Al-generated photo that was just created.
          </div>
          <div>
            <UploadSingle
              wrapperClassName={styles.upload}
              previewWrapperClassName={styles.preview}
              text="Supported: JPG, JPEG, PNG, GIF."
              title="Upload"
              onUploadChange={(file: ISingleFile) => {
                console.log('file:', file);
                setFile(file);
              }}
            />
          </div>
        </div>
        <div className="step3  mt-[32px]">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 3
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Set the name of nft</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary">
            It is recommended to use your own name or nickname.
          </div>
          <Input
            status={err ? 'error' : undefined}
            className="!mt-[16px] !bg-transparent !border-textPrimary"
            placeholder="Item name"
            onBlur={() => {
              if (!name?.length) {
                setErr('Please input your item name');
                return;
              }
            }}
            onChange={(e: ChangeEvent) => {
              const text = e.target?.value;
              const reg = /^[A-Za-z0-9]+$/;

              setName(text);
              if (!text?.length) {
                setErr('Please input your item name');
                return;
              }

              if (!reg.test(text)) {
                setErr('Invalid name. Please enter only letters and numbers.');
              } else {
                setErr(undefined);
              }

              console.log(text);
              //   debugger;
            }}
          />
          {err?.length && <span className="mt-[4px] ant-form-item-explain-error">{err}</span>}
        </div>
        <Button disabled={!checkValid} type="primary" className="mt-[16px] w-[146px] h-[48px]">
          Create
        </Button>
      </div>

      {/* <SuccessModal open={true} nftInfo={{}} onCreate={() => {}} /> */}
    </div>
  );
};

export default Activity;
