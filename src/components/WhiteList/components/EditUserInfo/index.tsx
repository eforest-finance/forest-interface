import { Button, Col, Form, Input, Row } from 'antd';
import CommonModal from '../CommonModal';
import TagSelect from '../TagSelect';
import { IModalWhiteListProps, StrategyType } from 'store/reducer/saleInfo/type';
import useGetState from 'store/state/getState';
import { IWhitelistExtraInfosItem } from 'api/types';
import { addPrefixSuffix } from 'utils';

const { Item: FormItem } = Form;

export interface IEditUserInfoFormValue {
  tagId: string;
  address: string;
}

interface EditUserInfoProps extends IModalWhiteListProps {
  editInfo?: IWhitelistExtraInfosItem;
  loading?: boolean;
  strategyType?: StrategyType;
  onFinish?: (v: IEditUserInfoFormValue) => void;
}

export default function EditUserInfo({ strategyType, editInfo, onFinish, loading, ...props }: EditUserInfoProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  return (
    <CommonModal {...props} title={'Edit'} closable={false} leftElement={false}>
      <Form
        initialValues={{
          tagId: editInfo?.tagInfo?.tagHash ?? '',
          address: addPrefixSuffix(editInfo?.address ?? ''),
        }}
        layout="vertical"
        className="edit-white-modal"
        name="edit_white_modal"
        onFinish={onFinish}
        autoComplete="off">
        {strategyType === StrategyType.Price && (
          <TagSelect label="Whitelist rank name" className="tool-whitelist-tag" />
        )}
        <FormItem className={`${isSmallScreen ? 'mt-[24px]' : 'mt-[40px]'}`} label="Wallet address" name="address">
          <Input.TextArea disabled className={`resize-none ${isSmallScreen ? 'h-[160px]' : 'h-[120px]'}`} />
        </FormItem>
        {!isSmallScreen ? (
          <Row justify="center" gutter={16} className="form-button-wrapper">
            <Col>
              <Button loading={loading} type="primary" htmlType="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button type="default" onClick={(e) => props?.onCancel?.(e)}>
                Return
              </Button>
            </Col>
          </Row>
        ) : (
          <div className="form-button-wrapper flex">
            <Button type="default" onClick={(e) => props?.onCancel?.(e)}>
              Return
            </Button>
            <Button loading={loading} type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        )}
      </Form>
    </CommonModal>
  );
}
