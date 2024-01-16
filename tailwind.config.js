/** @type {import('tailwindcss').Config} */
function withOpacityValue(variable) {
  return `var(${variable})`;
  // return ({ opacityValue }) => {
  //   if (opacityValue === undefined) {
  //     return `rgb(var(${variable}))`;
  //   }
  //   return `rgba(var(${variable}), ${opacityValue})`;
  // };
}
module.exports = {
  darkMode: ['class', '[class="dark-theme"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  corePlugins: {
    preflight: false, // <== disable this!
  },
  theme: {
    extend: {
      colors: {
        hover: 'var(--brand-base)',
        error: 'var(--error)',
        baseColor: withOpacityValue('--brand-base'),
        brandNormal: 'var(--brand-normal)',
        brandHover: 'var(--brand-hover)',
        brandClick: 'var(--brand-click)',
        brandDisable: 'var(--brand-disable)',
        functionalLink: 'var(--functional-link)',
        functionalSuccess: 'var(--functional-success)',
        functionalWarning: 'var(--functional-warning)',
        functionalLinkBg: 'var(--functional-link-bg)',
        functionalSuccessBg: 'var(--functional-success-bg)',
        functionalWarningBg: 'var(--functional-warning-bg)',
        functionalDanger: 'var(--functional-danger)',
        functionalDangerBg: 'var(--functional-danger-bg)',
        functionalDangerHover: 'var(--functional-danger-hover)',
        functionalDangerClick: 'var(--functional-danger-click)',
        functionalDangerDisable: 'var(--functional-danger-disable)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textDisable: 'var(--text-disable)',
        textWhite: 'var(--text-white)',
        lineBorder: 'var(--line-border)',
        lineDividers: 'var(--line-dividers)',
        lineDash: 'var(--line-dash)',
        fillCardBg: 'var(--fill-card-bg)',
        fillHoverBg: 'var(--fill-hover-bg)',
        fillClickBg: 'var(--fill-click-bg)',
        fillPageBg: 'var(--fill-page-bg)',
        fillMask1: 'var(--fill-mask-1)',
        fillMask2: 'var(--fill-mask-2)',
      },
      fontSize: {
        xs: ['12px', '20px'],
        sm: ['14px', '22px'],
        base: ['16px', '24px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['32px', '40px'],
        '5xl': ['40px', '48px'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      textColor: {
        baseColor: withOpacityValue('--brand-base'),
        hover: withOpacityValue('--box-hover'),
        brand: withOpacityValue('--brand-base'),
      },
      backgroundColor: {
        base: withOpacityValue('--brand-base'),
        hover: withOpacityValue('--brand-btn-hover'),
        disable: withOpacityValue('--forest-brand-disable'),
        content: withOpacityValue('--brand-base'),
      },
      ringColor: {},
      boxShadow: {
        hover: 'var(--box-hover)',
        error: 'var(--box-error)',
        modalHeader: '0px 4px 8px 0px var(--box-shadow-header)',
        detailModalHeader: '0px 4px 8px 0px #E6E7E9',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(-180deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        loading: 'loading 800ms linear infinite',
      },
      boxShadowColor: {},
      borderColor: {
        base: withOpacityValue('--brand-base'),
        brand: withOpacityValue('--brand-base'),
        hover: withOpacityValue('--border-hover'),
      },
      caretColor: {},
      accentColor: {},
    },

    screens: {
      xs: '360px',
      sm: '500px',
      pcMin: '500px',
      sml: '600px',
      md: '712px',
      mdb: '768px',
      mdl: '1024px',
      lg: '1036px',
      xlb: '1280px',
      xl: '1360px',
      '2xl': '1920px',
      smTW: '640px',
      mdTW: '768px',
      lgTW: '1024px',
      xlTW: '1280px',
      '2xlTW': '1536px',
      large: '2560px',
    },
  },
  plugins: [],
};
