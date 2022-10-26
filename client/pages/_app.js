import { useRouter } from "next/router";

import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { DataProvider } from "../context/index";
import Header from "../components/Header";
import { SSRProvider } from "react-bootstrap";
import Alert from "../components/Alert/Alert";
import Sidebar from "../components/NotifcationBar/Sidebar";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showBarLogin = router.pathname === "/" ? true : false;
  const showBarRegister = router.pathname === "/register" ? true : false;

  return (
    <>
      <SSRProvider>
        <DataProvider>
          <div className="main">
            {!showBarLogin && !showBarRegister && (
              <>
                <Header />
                <Sidebar/>
              </>
            )}
            <Alert />
            <Component {...pageProps} />
          </div>
        </DataProvider>
      </SSRProvider>
    </>
  );
}

export default MyApp;
