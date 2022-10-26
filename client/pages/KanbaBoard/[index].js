import React, { useContext, useEffect } from 'react';
import Router from "next/router";
import { AuthContext } from '../../context';
import withAuth from '../HOC/withAuth';

import KanbanBoard from '../../components/Role/Manager/kanbanBoard/index'

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
    <KanbanBoard/>
  )
}

export default withAuth(Index)