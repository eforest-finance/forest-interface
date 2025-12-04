import { Avatar, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import AWSManagerInstance from 'utils/S3';

import styles from './ProfileBanner.module.css';

import { useSelector } from 'store/store';
import Copy from 'components/Copy';

import AvatarDefault from 'assets/images/avatar.png';

import { OmittedType, getOmittedStr } from 'utils';
import { ImageEnhance } from 'components/ImgLoading';
import clsx from 'clsx';
import { acceptFileType } from 'pagesComponents/CreateItemV2/components/Upload/UploadBatch';
import { useCallback } from 'react';
import { saveUserSettings } from 'api/fetch';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

import EditOutlined from 'assets/images/edit.svg';

export default function ProfileBanner({
  bannerImage,
  profileImage,
  name,
  address,
  onChange,
}: {
  bannerImage: string;
  profileImage: string;
  name: string;
  address: string;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
  onChange: (type: string, src: string) => void;
}) {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const { login, isLogin } = useCheckLoginAndToken();

  const props: UploadProps = {
    name: 'File',
    accept: acceptFileType.picture,
    showUploadList: false,
    action: '',
    beforeUpload(file: File) {
      handleFileUpload(file, 'bannerImage');
    },
  };

  const profileImageProps: UploadProps = {
    ...props,
    beforeUpload: (file: File) => {
      handleFileUpload(file, 'profileImage');
    },
  };

  const handleFileUpload = useCallback(async (file: File, type: string) => {
    if (!isLogin) {
      login();
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    try {
      const { url, hash } = await AWSManagerInstance.uploadFile(file);
      console.log('url:', url);
      const res = await saveUserSettings({
        userUpdateType: type === 'profileImage' ? 1 : 2,
        [type]: url,
      });
      onChange(type, url);
      console.log(res);
    } catch (error) {
      console.error(error);
      message.error('File upload failed.');
    }
  }, []);

  return (
    <>
      <div
        className={clsx(styles['profile-banner-wrapper'], '')}
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}>
        <Upload {...props}>
          <div className="flex justify-center items-center group/bg w-full h-full absolute top-0 left-0 cursor-pointer">
            <EditOutlined className="left z-10  hidden group-hover/bg:block text-xl mdl:text-[48px] !text-textWhite" />
          </div>
        </Upload>

        <Avatar
          className=" !absolute left-4  -bottom-5  mdl:left-[40px] mdl:-bottom-[30px] !w-[82px] !h-[82px] mdl:!w-[168px] mdl:!h-[168px]   !bg-textWhite overflow-hidden"
          icon={
            <div className="group/avatar relative w-full h-full flex justify-center items-center">
              <ImageEnhance
                src={profileImage || AvatarDefault.src}
                className="group/avatar pointer-events-none w-[76px] h-[76px] mdl:!w-[156px] mdl:!h-[156px] overflow-hidden rounded-full"
              />
              <EditOutlined className="z-10 hidden group-hover/avatar:block absolute top-[26px] left-[26px] mdl:top-[66px] mdl:left-[66px] text-xl mdl:text-[48px] !text-textWhite" />
              <Upload {...profileImageProps}>
                <div className="group/avatar w-full h-full absolute top-0 left-0 cursor-pointer"></div>
              </Upload>
            </div>
          }
          alt="Avatar"
        />
      </div>
      <div className={styles['user-name']}>{name || 'Unnamed'}</div>
      <div className="flex items-center px-4 mdl:px-10 mt-2 ">
        <div className={styles['user-address']}>{getOmittedStr(address, OmittedType.ADDRESS)}</div>
        <Copy className="w-4 h-4 fill-textSecondary ml-2 cursor-pointer hover:fill-brandNormal" toCopy={address} />
      </div>
    </>
  );
}
