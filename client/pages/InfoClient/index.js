
import React, { useContext, useEffect } from 'react';
import Router from "next/router";
import { AuthContext } from '../../context';
import withAuth from '../HOC/withAuth';

import ClientIndex from '../../components/ModalComponents/Client/IndexClient'

function Index() {
  const state = useContext(AuthContext);
  const [isManager] = state.User.isManager;

  useEffect(()=>{
    const timer = setTimeout(() => {
      if(!isManager) Router.push('/') 
    }, 1000);
    return () => clearTimeout(timer);
  },[isManager])

  return (
    <ClientIndex/>
  )
}

export default withAuth(Index)