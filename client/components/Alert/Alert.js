import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../context";

function Alert() {
  const state = useContext(AuthContext);
  const alert = state.User.alert[0]

  const [showAlert, setShowAlert] = useState(false);
  const alertType = (message, type) => {
    if(type === 'SUCCESS') return toast.success(message); 
    if(type === 'ERROR') return toast.error(message) 
  };

  useEffect(() => {
    alertType(alert.message, alert.type);
    {
      alert.status ? setShowAlert(true) : setShowAlert(false);
    }
  }, [alert]);
  return (
    <>
      {showAlert ? (
        <Toaster
          position={alert.position}
          toastOptions={{
            duration: alert.duration,
            className: 'alertShow'
          }}
          
        />
      ) : null}
    </>
  );
}

{/* <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
  
    className: "",
    duration: 5000,
    style: {
      background: "#363636",
      color: "#fff",
    },


    success: {
      duration: 3000,
      theme: {
        primary: "green",
        secondary: "black",
      },
    },
  }}
/>; */}

export default Alert;
