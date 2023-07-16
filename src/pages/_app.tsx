import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Census Data</title>
        <meta
          name="description"
          content="Data viz for census and economic information"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
