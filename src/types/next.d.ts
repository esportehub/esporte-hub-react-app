// types/next.d.ts
import { NextComponentType, NextPage, NextPageContext } from 'next';

declare module 'next' {
  export type NextPageWithAuth<P = {0}, IP = P> = NextPage<P, IP> & {
    authRequired?: boolean;
  };

  export type AppPropsWithAuth = AppProps & {
    Component: NextComponentType<NextPageContext, any, any> & {
      authRequired?: boolean;
    };
  };
}