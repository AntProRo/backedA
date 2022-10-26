/* eslint-disable */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {  commonService } from "../../service/HttpNoTokenRequired/commonService";

const verifyAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);
    const { getRefreshToken } = commonService();
    const [returnPage, setReturnPage] = useState(false);
    
    useEffect(() => {
      try{
    
        const refreshToken = async () => {
         const res=  await getRefreshToken()
             if (res.status === 200) {
              setVerified(false);
              setReturnPage(true);
            } else {
              setVerified(true);
              setReturnPage(false);
            }  

        };
       refreshToken()
      }catch(err){
        console.log(err)
      }

      if (returnPage) {
        Router.replace("/DashboardSession");
      }
    }, [verified, returnPage]);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default verifyAuth;
