import { store } from 'store/store';
import { Proto } from './proto';
import { getProto } from './deserializeLog';
import { currentRpcUrl } from 'constants/index';

const initializeProto = async (contractAddress: string) => {
  const configInfo = store.getState().aelfInfo.aelfInfo;
  const sideChain = currentRpcUrl[configInfo.curChain as Chain];

  if (configInfo?.[sideChain] && contractAddress) {
    const protoBuf = await getProto(contractAddress, configInfo?.[sideChain]);
    console.log('protoBuf', protoBuf);
    const proto = Proto.getInstance();
    proto.setProto(contractAddress, protoBuf);
  }
};

export default initializeProto;
