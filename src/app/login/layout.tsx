'use client';
import React, { useEffect, useRef, useState } from 'react';

import LoadingAnimation from 'components/Loading/LoadingAnimation';

import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setLoginStatus } from 'redux/reducer/info';
import { did } from '@portkey/did-ui-react';

import { useRouter } from 'next/navigation';
import useGetState from 'redux/state/useGetState';
import { KEY_NAME } from 'constants/platform';
import { LoginStatus } from 'redux/types/reducerTypes';

const MAX_SINGLE_REQUEST_TIME = 3 * 1000;
const MAX_SHEDULE_TIME = 30 * 1000;

const Layout = dynamic(
  async () => {
    return (props: React.PropsWithChildren<{}>) => {
      const { children } = props;

      const unLoadSourceRef = useRef(0);

      const [hasLoadedSource, setHasLoadedSource] = useState(false);

      const { isMobile: isMobileStore, chessBoardInfo, imageResources, isLogin, btnImageResources } = useGetState();

      const router = useRouter();

      const [resurceList, setResurceList] = useState<Array<string>>([]);

      const [chessMap, setChessMap] = useState<Array<string>>([]);

      const [sourceLoded, setSourceLoded] = useState(false);

      const [bgImage, setBgImage] = useState('');

      const loadResourceList = () => {
        if (!chessMap.length && !resurceList.length) {
          setTimeout(() => {
            setHasLoadedSource(true);
          }, 1000);
        }
        const sourceMap = [...resurceList, ...chessMap];

        const timeTask = new Promise(function (resolve) {
          setTimeout(resolve, MAX_SHEDULE_TIME, false);
        });

        const scheduleTask = new Promise(function (resolve) {
          const start = Date.now();
          const schedule = (src: string) => {
            const img = document.createElement('img');
            img.src = src;
            const len = sourceMap.filter((i) => i).length;
            img.onload = img.onerror = () => {
              unLoadSourceRef.current = unLoadSourceRef.current + 1;
              if (unLoadSourceRef.current >= len) {
                if (Date.now() - start > MAX_SINGLE_REQUEST_TIME) {
                  resolve(true);
                } else {
                  setTimeout(() => {
                    resolve(true);
                  }, MAX_SINGLE_REQUEST_TIME - (Date.now() - start));
                }
              }
            };
          };
          sourceMap.forEach((src) => {
            schedule(src);
          });
        });

        Promise.race([timeTask, scheduleTask]).then(() => {
          console.log('over');
          setHasLoadedSource(true);
        });
      };

      useEffect(() => {
        if (typeof window !== undefined) {
          if (window.localStorage.getItem(KEY_NAME)) {
            did.reset();
            store.dispatch(setLoginStatus(LoginStatus.LOCK));
          }
        }
      }, []);

      useEffect(() => {
        sourceLoded && loadResourceList();
      }, [sourceLoded]);

      useEffect(() => {
        if (!chessBoardInfo || !imageResources) return;

        const bgPc = imageResources['aloginBgPc'];
        const bgM = imageResources['aloginBgMobile'];
        setBgImage(isMobileStore ? bgM : bgPc);

        let imageResourcesArray: Array<string> = [];
        for (const picName in imageResources) {
          if (picName !== 'aloginBgPc' && picName !== 'aloginBgMobile') {
            imageResourcesArray.push(imageResources[picName]);
          }
        }
        const btnResources = isMobileStore ? btnImageResources!.mobile : btnImageResources!.pc;
        for (const picName in btnResources) {
          imageResourcesArray.push(btnResources[picName]);
        }
        imageResourcesArray = [isMobileStore ? bgM : bgPc, ...imageResourcesArray];

        setResurceList(imageResourcesArray);
        const chessMap: string[] = [];
        if (chessBoardInfo.length) {
          chessBoardInfo.forEach((item, index) => {
            item.forEach((_, index1) => {
              chessMap.push(chessBoardInfo[index][index1].image!);
            });
          });
        }
        setChessMap(chessMap);
        setSourceLoded(true);
      }, [chessBoardInfo]);

      useEffect(() => {
        router.prefetch('/');
      }, []);

      return hasLoadedSource ? (
        <>
          {children}
          <div
            className="w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}></div>
        </>
      ) : (
        <>
          <LoadingAnimation />
          <div
            className="w-[100vw] h-[100vh] absolute top-0 left-0 !bg-cover bg-center bg-no-repeat z-[-1000]"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}></div>
        </>
      );
    };
  },
  { ssr: false },
);

export default Layout;
