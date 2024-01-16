import ELF from './ELF-blue.svg';
import TEST_ELF from './aelf.svg';

const { NEXT_PUBLIC_APP_ENV } = process.env;

const ELF_LOGO = NEXT_PUBLIC_APP_ENV === 'production' ? ELF : TEST_ELF;

export default ELF_LOGO;
