export const transactionPending = 'Pending transaction confirmation';
export const confirmationAuto = 'Please wait for auto confirmation.';

export const OfferMessage = {
  title: 'Approve Offer',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the offer in the wallet.',
  },
};

export const DealMessage = {
  title: 'Accept Offer',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please accept the offer in the wallet.',
  },
  errorMessage: {
    title: 'Offer Acceptance Failed',
    tips: 'All offers failed to be accepted',
    description:
      'Failure could be due to network issues, transaction fee increases, or someone else accepting the offer before you.',
  },
};

export const TransferMessage = {
  title: 'Transfer NFT',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the transfer in the wallet.',
  },
};

export const BuyMessage = {
  title: 'Approve Purchase',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the purchase in the wallet.',
  },
  errorMessage: {
    title: 'Purchase Failed',
    tips: 'Purchase of all items failed',
    description:
      'Purchase failure could be due to network issues, transaction fee increases, or someone else acquiring the item before you.',
  },
};

export const ListingMessage = {
  title: 'Approve Listing',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the listing in the wallet.',
  },
};

export const CancelListingMessage = {
  title: 'Cancel Listing',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the listing cancellation in the wallet.',
  },
};

export const CancelOfferMessage = {
  title: 'Cancel Offer',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please cancel the offer in the wallet.',
  },
};

export const MintNftMessage = {
  title: 'Mint NFT',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the minting in the wallet.',
  },
  successMessage: {
    title: 'NFT Successfully Minted!',
  },
  partiallyMessage: {
    title: 'Minting Partially Completed',
  },
  errorMessage: {
    title: 'Minting Failed',
    description:
      'Minting failure could be due to network issues, transaction fee increases, or someone else minting the item before you.',
  },
};
