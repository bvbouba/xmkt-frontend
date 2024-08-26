import { createInstance, i18n as i18nInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { defaultNS, getOptions } from './settings'
import { useEffect, useState } from 'react'

const initI18next = async (lng:string, ns:string): Promise<i18nInstance>=> {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng))
  return i18nInstance
}

let initialized = false;

// Initialize i18next synchronously
function initializeI18next(lng: string, ns: string) {
  if (!initialized) {
    initI18next(lng, ns);
    initialized = true;
  }
}


export function useTranslation(lng: string, ns: string = defaultNS, options: any = {}) {
    const [i18n, setI18n] = useState<i18nInstance | null>(null);
    const [t, setT] = useState<(key: string, options?: any) => string>(() => (key: string) => key);

    useEffect(() => {
      let isMounted = true;
  
      const initialize = async () => {
        const i18nextInstance = await initI18next(lng, ns);
        if (isMounted) {
          setI18n(i18nextInstance);
          setT(() => i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix));
        }
      };
  
      initialize();
  
      return () => {
        isMounted = false;
      };
    }, [lng, ns, options]);
  
    return { t, i18n };
  }