import React from 'react';
import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const TGSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 44 44" fill="none">
    <path
      d="M4.4523 19.8894L28.279 10.1753C30.6309 9.16347 38.6073 5.92546 38.6073 5.92546C38.6073 5.92546 42.2886 4.50884 41.9818 7.94922C41.8796 9.36584 41.0615 14.324 40.2434 19.687L37.6869 35.5734C37.6869 35.5734 37.4824 37.9008 35.744 38.3055C34.0055 38.7103 31.1422 36.8889 30.6309 36.4841C30.2219 36.1806 22.9614 31.6271 20.3027 29.401C19.5868 28.7939 18.7687 27.5796 20.4049 26.163C24.0863 22.8238 28.4835 18.6751 31.1422 16.0442C32.3694 14.83 33.5965 11.9967 28.4835 15.4371L14.0648 25.0499C14.0648 25.0499 12.4286 26.0618 9.3608 25.1511C6.29299 24.2404 2.71387 23.0262 2.71387 23.0262C2.71387 23.0262 0.259625 21.5084 4.4523 19.8894Z"
      fill="white"
    />
  </svg>
);

export default function TGIcon({ ...props }: Partial<CustomIconComponentProps>) {
  return <Icon component={TGSvg} {...props} />;
}
