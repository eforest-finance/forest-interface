'use client';
import { Col, Form, message, Row, Tooltip, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Photo from 'assets/images/photo.svg';
import WarningMark from 'assets/images/waring.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Copy from 'components/Copy';
import { useSelector } from 'store/store';

import styles from './settings.module.css';
import useSaveSettings from './hooks/useSaveSettings';
import useUsernameCheck from './hooks/useUsernameCheck';
import { useUnmount } from 'react-use';
import useUserInfo from 'hooks/useUserInfo';
import AWSManagerInstance from 'utils/S3';
import { emailReg, instagramReg, twitterReg } from 'constants/common';
import Input from 'baseComponents/Input';
import Button from 'baseComponents/Button';
import { useLogoutListener } from 'hooks/useLogoutListener';
import { useDebounceFn } from 'ahooks';

export default function Settings() {
  const {
    info: { isSmallScreen },
    userInfo: { userInfo, walletInfo },
  } = useSelector((store) => store);
  const getUserInfo = useUserInfo();
  const saveSettings = useSaveSettings();
  const checkName = useUsernameCheck();
  const { address } = walletInfo;
  const [avatar, setAvatar] = useState<string | undefined>(userInfo.profileImage);
  const [banner, setBanner] = useState<string | undefined>(userInfo.bannerImage);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const unMounted = useRef<boolean>(false);

  useLogoutListener();

  const [form, setForm] = useState<{
    [x: string]: {
      value: string;
      validateStatus?: boolean;
      errorMsg?: string | null;
    };
  }>({
    username: { value: userInfo?.name || '' },
    email: { value: userInfo.email || '' },
    twitter: { value: userInfo.twitter || '' },
    instagram: { value: userInfo.instagram || '' },
  });

  const [usernameCheck, setUsernameCheck] = useState({ checked: false, isUsed: false });

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    setForm({
      username: { value: userInfo?.name },
      email: { value: userInfo.email || '' },
      twitter: { value: userInfo.twitter || '' },
      instagram: { value: userInfo.instagram || '' },
    });
    setAvatar(userInfo.profileImage);
    setBanner(userInfo.bannerImage);
  }, [userInfo]);

  useUnmount(() => {
    message.destroy();
    unMounted.current = true;
  });

  const beforeUpload = async (file: File, type: string) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.destroy();
      message.error('File upload failed. The supported formats are JPG and PNG');
      return false;
    }
    const isLt25M = file.size / 1024 / 1024 < 25;
    if (!isLt25M) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }
    if (isJpgOrPng && isLt25M) {
      message.loading('Uploading', 0);
    }

    const uploadFile = await AWSManagerInstance.uploadFile(file);
    if (unMounted.current) return;
    type === 'avatar' ? setAvatar(uploadFile.url) : setBanner(uploadFile.url);
    message.destroy();
    message.success(`${file.name} file uploaded successfully.`);
    return isJpgOrPng && isLt25M;
  };

  const validateForm = useCallback(
    (string: string, key: string): { validateStatus: boolean; errorMsg: string | null } => {
      const regObj: { [x: string]: RegExp } = {
        username: /^[A-Za-z0-9]+$/,
        email: emailReg,
        twitter: twitterReg,
        instagram: instagramReg,
      };
      if (regObj[key].test(string) && string.length > 0) {
        return {
          validateStatus: true,
          errorMsg: null,
        };
      }
      return {
        validateStatus: true,
        errorMsg: 'error',
      };
    },
    [],
  );

  const { run: checkUsernameUsed } = useDebounceFn(
    async (userName: string) => {
      if (!userName) return;
      setUsernameCheck({ checked: false, isUsed: false });
      const result = await checkName(userName);
      if (!result) {
        setUsernameCheck({ checked: false, isUsed: false });
      }
      setUsernameCheck({ checked: true, isUsed: !result });
    },
    {
      leading: true,
    },
  );

  const uploadButton = uploading ? (
    <LoadingOutlined />
  ) : (
    <span className="w-[96px] h-[96px]">
      <Photo />
    </span>
  );

  const onFormChange = useCallback(
    (event: any, key: string) => {
      const { value } = event.target;
      switch (key) {
        case 'username':
          setForm((v) => ({ ...v, username: { ...validateForm(value, 'username'), value } }));
          setUsernameCheck({ checked: false, isUsed: false });
          break;
        default:
          setForm((v) => ({ ...v, [key]: { ...validateForm(value, key), value } }));
          break;
      }
    },
    [validateForm],
  );

  const save = useCallback(() => {
    setLoading(true);
    saveSettings({
      name: form.username.value,
      email: form.email.value,
      twitter: form.twitter.value,
      instagram: form.instagram.value,
      bannerImage: banner || userInfo?.bannerImage || '',
      profileImage: avatar || userInfo?.profileImage || '',
    }).then(() => {
      setLoading(false);
      getUserInfo();
    });
  }, [form, getUserInfo, saveSettings]);

  const userInfoModifyStatus = ['name', 'email', 'twitter', 'instagram', 'bannerImage', 'profileImage'].some((key) => {
    let toBeEqualRes = String(form[key]?.value || '').trim();
    if (key === 'name') {
      toBeEqualRes = String(form.username?.value || '').trim();
    }
    if (key === 'bannerImage') {
      toBeEqualRes = banner || '';
    }
    if (key === 'profileImage') {
      toBeEqualRes = avatar || '';
    }
    String(userInfo?.[key] || '').trim() !== toBeEqualRes &&
      console.log(
        'userInfoModifyStatus key',
        key,
        String(userInfo?.[key] || '').trim() !== toBeEqualRes,
        userInfo?.[key] || '',
        toBeEqualRes,
      );

    return String(userInfo?.[key] || '').trim() !== toBeEqualRes;
  });

  const nameErrorStatus = useMemo(
    () => usernameCheck.isUsed || (form.username.validateStatus && form.username.errorMsg),
    [form.username.errorMsg, form.username.validateStatus, usernameCheck.isUsed],
  );

  return (
    <div className={`${styles['settings']} ${isSmallScreen ? styles['mobile-settings'] : ''}`}>
      <div className={styles['main-container']}>
        <div className={styles['main-wrap']}>
          <h1 className={styles['settings-main-title']}>Profile Settings</h1>
          <div className={styles['settings-wrap']}>
            <Row gutter={[isSmallScreen ? 0 : 72, isSmallScreen ? 24 : 40]}>
              <Col>
                <p className={styles['settings-sub-title']}>
                  Profile Image{' '}
                  <Tooltip
                    title={
                      <span>
                        350 x 350 px recommended
                        <br />
                        Max size: 25MB
                      </span>
                    }>
                    <WarningMark />
                  </Tooltip>
                </p>
                <Upload
                  accept=".jpeg,.jpg,.png"
                  name="Files"
                  action={''}
                  listType="picture-card"
                  className={styles['avatar-uploader']}
                  showUploadList={false}
                  beforeUpload={(e) => beforeUpload(e, 'avatar')}>
                  <div className={styles['avatar']}>
                    {avatar || userInfo?.profileImage ? (
                      <img
                        className={'border border-solid border-[var(--line-box)] w-full'}
                        src={`${avatar || userInfo?.profileImage}`}
                        alt="avatar"
                      />
                    ) : (
                      uploadButton
                    )}
                  </div>
                </Upload>
              </Col>
              <Col span={isSmallScreen ? 24 : 16}>
                <p className={styles['settings-sub-title']}>
                  Profile Banner{' '}
                  <Tooltip
                    title={
                      <span>
                        1400 x 400 px recommended
                        <br />
                        Max size: 25MB
                      </span>
                    }>
                    <WarningMark />
                  </Tooltip>
                </p>
                <Upload
                  accept=".jpeg,.jpg,.png"
                  name="Files"
                  className={`${styles['banner-upload']} rounded-[12px]`}
                  action={''}
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={(e) => beforeUpload(e, 'banner')}>
                  <div className={styles['banner']}>
                    {!!(banner || userInfo?.bannerImage) && <img src={`${banner || userInfo?.bannerImage}`} />}
                  </div>
                </Upload>
              </Col>
              <Col span={24}>
                <p className={styles['settings-sub-title']}>
                  Username<span className={styles['require']}>*</span>
                </p>
                <Form.Item className="!mb-0">
                  <Input
                    showCount
                    size="large"
                    value={form.username.value}
                    onChange={(e) => {
                      onFormChange(e, 'username');
                      checkUsernameUsed(e.target.value);
                    }}
                    minLength={1}
                    maxLength={20}
                    status={nameErrorStatus ? 'error' : ''}
                    type="text"
                  />
                  {usernameCheck.isUsed ? (
                    <p className="text-functionalDanger">This name has been taken.</p>
                  ) : (
                    form.username.validateStatus &&
                    form.username.errorMsg &&
                    (form.username.value ? (
                      <p className="text-functionalDanger">Invalid username. Please enter only letters and numbers.</p>
                    ) : (
                      <p className="text-functionalDanger">Username is required.</p>
                    ))
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className={styles['settings-sub-title']}>Wallet Address</p>
                <div className={styles['wallet-address']}>
                  <p>{userInfo?.fullAddress || address}</p>
                  <Copy className={styles['copy-btn']} toCopy={userInfo?.fullAddress || address || ''} />
                </div>
              </Col>
              <Col span={24}>
                <p className={styles['settings-sub-title']}>Email</p>
                <Form.Item className="!mb-0">
                  <Input
                    value={form.email.value}
                    size="large"
                    onChange={(e) => onFormChange(e, 'email')}
                    maxLength={100}
                    status={form.email.validateStatus && form.email.errorMsg && form.email.value ? 'error' : ''}
                    type="text"
                  />
                  {form.email.validateStatus && form.email.errorMsg && form.email.value && (
                    <p className="text-functionalDanger">Invalid email URL</p>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className={styles['settings-sub-title']}>Twitter</p>
                <Form.Item className="!mb-0">
                  <Input
                    size="large"
                    value={form.twitter.value}
                    onChange={(e) => onFormChange(e, 'twitter')}
                    type="text"
                    status={form.twitter.validateStatus && form.twitter.errorMsg && form.twitter.value ? 'error' : ''}
                    maxLength={100}
                  />
                  {form.twitter.validateStatus && form.twitter.errorMsg && form.twitter.value && (
                    <p className="text-functionalDanger">Invalid Twitter URL</p>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className={styles['settings-sub-title']}>Instagram</p>
                <Form.Item className="!mb-0">
                  <Input
                    size="large"
                    value={form.instagram.value}
                    onChange={(e) => onFormChange(e, 'instagram')}
                    type="text"
                    status={
                      form.instagram.validateStatus && form.instagram.errorMsg && form.instagram.value ? 'error' : ''
                    }
                    maxLength={100}
                  />
                  {form.instagram.validateStatus && form.instagram.errorMsg && form.instagram.value && (
                    <p className="text-functionalDanger">Invalid Instagram URL</p>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <Row gutter={[isSmallScreen ? 0 : 72, isSmallScreen ? 24 : 40]}>
          <Col className={styles['settings-btn-wrap']}>
            <Row
              gutter={isSmallScreen ? 0 : 16}
              className={`justify-center items-center ${isSmallScreen ? 'p-0' : 'p-x-[12px] p-y-0'} `}>
              <Col>
                <Button
                  disabled={
                    !userInfoModifyStatus ||
                    Boolean(form.username.errorMsg) ||
                    !form.username.value ||
                    !usernameCheck.checked ||
                    usernameCheck.isUsed ||
                    (!!form.email.value && !!form.email.errorMsg) ||
                    (!!form.twitter.value && !!form.twitter.errorMsg) ||
                    (!!form.instagram.value && !!form.instagram.errorMsg)
                  }
                  loading={loading}
                  type="primary"
                  onClick={save}
                  size="ultra"
                  className={`${isSmallScreen ? '!w-full' : '!w-[180px]'}`}>
                  Save
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
