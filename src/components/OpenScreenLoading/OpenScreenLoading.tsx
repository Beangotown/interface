'use client';
import { useEffect, useCallback, useState } from 'react';
import { eventBus } from 'utils/lib';
import { OPEN_SCREEN_LOADING_EVENT_NAME } from 'constants/animation';
import OpenScreenLoadingInner from './OpenScreenLoadingInner';

const OpenScreenLoading = () => {
  const [loading, setLoading] = useState(true);

  const goPlay = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  useEffect(() => {
    eventBus.addListener(OPEN_SCREEN_LOADING_EVENT_NAME, goPlay);
    return () => {
      eventBus.removeListener(OPEN_SCREEN_LOADING_EVENT_NAME, goPlay);
    };
  }, [goPlay]);

  return <OpenScreenLoadingInner loading={loading} />;
};

export default OpenScreenLoading;
