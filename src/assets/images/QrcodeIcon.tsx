import React from 'react';
import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const QrcodeSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.58637 6.50206C4.58637 7.23844 5.18333 7.83539 5.91971 7.83539H6.50363C7.24002 7.83539 7.83697 7.23844 7.83697 6.50206V5.91831C7.83697 5.18193 7.24002 4.58497 6.50363 4.58497H5.91971C5.18333 4.58497 4.58637 5.18193 4.58637 5.91831V6.50206ZM19.4157 16.6972C19.4157 16.4026 19.177 16.1638 18.8824 16.1638H16.6985C16.4039 16.1638 16.1651 16.4026 16.1651 16.6972V17.7891L14.87 17.7891C14.5755 17.7891 14.3367 17.5503 14.3367 17.2558V14.8689C14.3367 14.5743 14.5755 14.3355 14.87 14.3355H15.6318C15.9264 14.3355 16.1651 14.0968 16.1651 13.8022V13.2437C16.1651 12.9491 15.9264 12.7103 15.6318 12.7103H13.2447C12.9502 12.7103 12.7114 12.9491 12.7114 13.2437V22.1314C12.7114 22.426 12.9502 22.6647 13.2447 22.6647H15.6318C15.9264 22.6647 16.1651 22.426 16.1651 22.1314V21.5728C16.1651 21.2783 15.9264 21.0395 15.6318 21.0395H14.87C14.5755 21.0395 14.3367 20.8007 14.3367 20.5062V19.9476C14.3367 19.6531 14.5755 19.4143 14.87 19.4143H15.6318C15.9264 19.4143 16.1651 19.1755 16.1651 18.881V17.7891H17.2571C17.5517 17.7891 17.7905 18.0278 17.7905 18.3224V20.5062C17.7905 20.8007 18.0292 21.0395 18.3238 21.0395H18.8824C19.177 21.0395 19.4158 21.2783 19.4158 21.5728V22.1314C19.4158 22.4259 19.6545 22.6647 19.9491 22.6647H22.133C22.4276 22.6647 22.6664 22.4259 22.6664 22.1314V21.5728C22.6664 21.2783 22.4276 21.0395 22.133 21.0395H21.5744C21.2798 21.0395 21.0411 20.8007 21.0411 20.5062V19.9476C21.0411 19.653 20.8023 19.4143 20.5077 19.4143H19.9491C19.6545 19.4143 19.4157 19.1755 19.4157 18.8809V16.6972ZM22.6681 13.244C22.6681 12.9494 22.4294 12.7106 22.1348 12.7106H21.5762C21.2816 12.7106 21.0428 12.9494 21.0428 13.244V13.8025C21.0428 14.0971 20.8041 14.3358 20.5095 14.3358H19.4175V13.244C19.4175 12.9494 19.1787 12.7106 18.8842 12.7106H18.3255C18.031 12.7106 17.7922 12.9494 17.7922 13.244V13.8025C17.7922 14.0971 18.031 14.3358 18.3255 14.3358H19.4175V15.6309C19.4175 15.9254 19.6563 16.1642 19.9509 16.1642H20.5095C20.8041 16.1642 21.0428 16.403 21.0428 16.6975V17.2561C21.0428 17.5506 21.2816 17.7894 21.5762 17.7894H22.1348C22.4294 17.7894 22.6681 17.5506 22.6681 17.2561V13.244ZM1.33499 21.3319C1.33499 22.0683 1.93195 22.6652 2.66833 22.6652H9.75343C10.4898 22.6652 11.0868 22.0683 11.0868 21.3319V14.0442C11.0868 13.3078 10.4898 12.7108 9.75343 12.7108H2.66833C1.93195 12.7108 1.33499 13.3078 1.33499 14.0442V21.3319ZM2.95848 15.2698C2.95848 14.7543 3.37635 14.3365 3.89182 14.3365H8.52632C9.04179 14.3365 9.45966 14.7543 9.45966 15.2698V20.1071C9.45966 20.6226 9.04179 21.0405 8.52632 21.0405H3.89182C3.37635 21.0405 2.95848 20.6226 2.95848 20.1071V15.2698ZM4.58637 18.0821C4.58637 18.8185 5.18333 19.4155 5.91971 19.4155H6.50363C7.24002 19.4155 7.83697 18.8185 7.83697 18.0821V17.4984C7.83697 16.762 7.24002 16.165 6.50363 16.165H5.91971C5.18333 16.165 4.58637 16.762 4.58637 17.4984V18.0821ZM14.0448 1.33497C13.3084 1.33497 12.7114 1.93193 12.7114 2.66831V9.75288C12.7114 10.4893 13.3084 11.0862 14.0448 11.0862H21.3331C22.0694 11.0862 22.6664 10.4893 22.6664 9.75288V2.66831C22.6664 1.93193 22.0694 1.33497 21.3331 1.33497H14.0448ZM1.33529 9.75223C1.33529 10.4886 1.93224 11.0856 2.66862 11.0856H9.75372C10.4901 11.0856 11.0871 10.4886 11.0871 9.75223V2.66766C11.0871 1.93128 10.4901 1.33432 9.75372 1.33432H2.66862C1.93224 1.33432 1.33529 1.93128 1.33529 2.66766V9.75223ZM2.95848 3.89279C2.95848 3.37732 3.37635 2.95945 3.89182 2.95945H8.52632C9.04179 2.95945 9.45966 3.37732 9.45966 3.89279V8.52694C9.45966 9.04241 9.04179 9.46028 8.52632 9.46028H3.89182C3.37635 9.46028 2.95848 9.04241 2.95848 8.52694V3.89279ZM19.4165 5.91831C19.4165 5.18193 18.8195 4.58497 18.0832 4.58497H17.4992C16.7628 4.58497 16.1659 5.18193 16.1659 5.91831V6.50206C16.1659 7.23844 16.7628 7.83539 17.4992 7.83539H18.0832C18.8195 7.83539 19.4165 7.23844 19.4165 6.50206V5.91831ZM14.5133 3.89279C14.5133 3.37732 14.9312 2.95945 15.4466 2.95945H20.0811C20.5966 2.95945 21.0145 3.37732 21.0145 3.89279V8.52694C21.0145 9.04241 20.5966 9.46028 20.0811 9.46028H15.4466C14.9312 9.46028 14.5133 9.04241 14.5133 8.52694V3.89279Z"
      fill="#244CBD"
    />
  </svg>
);

export default function QrcodeIcon({ ...props }: Partial<CustomIconComponentProps>) {
  return <Icon component={QrcodeSvg} {...props} />;
}