import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useAuthContext } from "./service/auth/useAuthContext";
import {  createBrowserRouter, RouterProvider } from "react-router-dom";
import { useActor } from '@xstate/react';
import SignInSide from './widgets/login/Main'
import { NoMatch } from './pages/NoMatch'
import  { InboxLayout, MessagingListReceived, MessageDetails } from './widgets/inbox'


const anonimous_routes = createBrowserRouter([
  {
    path: "/",
    element: <SignInSide />,
  },
]);



const authentificated_routes = createBrowserRouter([
  {
    path: "/",
    element: <InboxLayout />,
    children: [
      { index: true, element: <MessagingListReceived /> },
      { path: "/messages/:messageId", element: <MessageDetails /> },
      { path: "sent", element: <NoMatch /> },
      { path: "*", element: <NoMatch /> },
    ],
  },
]);




function App() {

  const {authService} = useAuthContext()
  const [state] = useActor(authService);


  return (

    state.matches('anonimous')?
    ( 
      <RouterProvider router={anonimous_routes} /> 
    )
    :
    state.matches('authenticated')?
    (
      <RouterProvider router={authentificated_routes} /> 
    )
   :<>Loading</>


  );
}

export default App;
