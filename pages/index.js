import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Main from "./Main";

export default function Home() {
  return (
    <>
      <Head>
        <title>Shopeasy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <Main/>
      <Footer/>
    </>
  );
}
