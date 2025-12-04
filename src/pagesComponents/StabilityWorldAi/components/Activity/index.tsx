import Banner from 'assets/images/stabilityWorldAi/banner.svg';
import Button from 'baseComponents/Button';

import UploadSingle from 'pagesComponents/CreateItemV2/components/Upload/UploadSingle';
import { ISingleFile } from 'store/reducer/create/item';
import { ChangeEvent, useCallback, useState } from 'react';
import Input, { TextArea } from 'baseComponents/Input';

import styles from './style.module.css';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { DoubleCheck, Creating, SuccessModal } from '../Modals';
import { fetchCreatePlatformNFT } from 'api/fetch';
import { message } from 'antd';
import useGetState from 'store/state/getState';

const Activity = () => {
  const [file, setFile] = useState<ISingleFile>();
  const { isLogin, login } = useCheckLoginAndToken();
  const [err, setErr] = useState<string>();
  const [name, setName] = useState<string>();
  const [doubleCheckVisible, setDoubleCheckVisible] = useState(false);
  const [creatingVisible, setCreatingVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [nftInfo, setNftInfo] = useState<any>();

  const { infoState } = useGetState();

  const { isSmallScreen } = infoState;

  const checkValid = Boolean(!err?.length && file && name?.trim()?.length);
  console.log('checkValid:', checkValid);

  const handleCreate = async () => {
    setDoubleCheckVisible(false);
    setCreatingVisible(true);
    try {
      const params = {
        NFTUrl: file!.url || '',
        NFTName: name || '',
        urlHash: file!.hash || '',
      };
      const res = await fetchCreatePlatformNFT(params);
      const nftInfo = {
        ...res,
        nftName: name,
        nftIcon: file?.url,
      };

      setNftInfo(nftInfo);
      setSuccessVisible(true);
    } catch (error) {
      console.log(error);
      message.error(error);
    }

    setCreatingVisible(false);
  };
  const activityLink = 'https://t.me/stabilityworld_ai_bot/start?startapp=4B28AE057325F494';

  return (
    <div className="w-full h-full relative">
      <div className="py-0 lg:pt-[80px] lg:pb-[40px]">
        <Banner width={'100%'} height={'auto'} />
      </div>
      <div className="px-[16px]">
        <div className="step1">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 1
            </span>
            <span className="text-[18px] font-medium text-textPrimary">
              Create Al Image with{' '}
              {!isSmallScreen && (
                <a href={activityLink} target="_blank" rel="noreferrer noopener" className="text-[#1B76E2]">
                  Stability World AI TG mini app
                </a>
              )}
            </span>
          </div>
          {isSmallScreen && (
            <div className="mt-[16px]">
              <a href={activityLink} target="_blank" rel="noreferrer noopener" className="text-[#1B76E2]">
                Stability World AI TG mini app
              </a>
            </div>
          )}
          <div className="mt-[16px] text-[14px] text-textSecondary leading-5">
            Create and save your AI image to mint it as an NFT.
          </div>
        </div>
        <div className="step1 mt-[40px]">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 2
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Login to Forest</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary leading-5">
            Sign up or login to your account with Google, Telegram or Email.
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
        <div className="step2 mt-[40px]">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 3
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Upload Your AI Image</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary">
            Upload the AI generated image from{' '}
            {!isSmallScreen && (
              <a href={activityLink} target="_blank" rel="noreferrer noopener" className="text-[#1B76E2] text-[14px]">
                Stability World AI TG mini app
              </a>
            )}
          </div>
          {isSmallScreen && (
            <div className="mt-[4px]">
              <a href={activityLink} target="_blank" rel="noreferrer noopener" className="text-[#1B76E2] text-[14px]">
                Stability World AI TG mini app
              </a>
            </div>
          )}
          <div className="relative">
            {!isLogin && (
              <div
                className="w-full h-[180px] absolute z-10"
                onClick={(e: any) => {
                  if (!isLogin) {
                    e.preventDefault();
                    e.stopPropagation();
                    login();
                  }
                }}
              />
            )}

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
        <div className="step3  mt-[40px]">
          <div className="flex items-center">
            <span className="mr-[8px] rounded-[6px] bg-functionalLinkBg px-[12px] py-[6px] text-brandNormal text-[16px] font-semibold">
              Step 4
            </span>
            <span className="text-[18px] font-medium text-textPrimary">Name your NFT</span>
          </div>
          <div className="mt-[16px] text-[14px] text-textSecondary leading-5">
            Special characters are not allowed. This will be reflected on the collection and details page.
          </div>
          <Input
            status={err ? 'error' : undefined}
            maxLength={30}
            className="!mt-[16px] !bg-transparent !border-textPrimary"
            placeholder="Nft name"
            onBlur={() => {
              const trimName = name?.trim();
              setName(trimName);
              if (!name?.length) {
                setErr('Please input your item name');
                return;
              }
            }}
            onChange={(e: ChangeEvent) => {
              const text = (e.target?.value as string).trim();
              const reg = /^[A-Za-z0-9 ]+$/;

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
            }}
          />
          {err?.length && <span className="mt-[4px] ant-form-item-explain-error">{err}</span>}
        </div>
        <Button
          onClick={() => {
            setDoubleCheckVisible(true);
          }}
          disabled={!checkValid}
          type="primary"
          className="mt-[16px] w-full h-[48px] mb-[48px]">
          Create
        </Button>
      </div>

      <DoubleCheck
        name={name || ''}
        file={file}
        open={doubleCheckVisible}
        onCreate={handleCreate}
        onClose={() => {
          setDoubleCheckVisible(false);
        }}
      />

      <Creating open={creatingVisible} />
      {successVisible && (
        <SuccessModal
          open={successVisible}
          nftInfo={nftInfo}
          onClose={() => {
            setSuccessVisible(false);
          }}
          onCreate={() => {
            // create
          }}
        />
      )}
    </div>
  );
};

export default Activity;
