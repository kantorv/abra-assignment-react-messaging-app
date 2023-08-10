import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useAuthContext } from "./service/auth/useAuthContext";
import {  createBrowserRouter, RouterProvider } from "react-router-dom";
import { useActor } from '@xstate/react';
import SignInSide from './widgets/login/Main'
import { NoMatch } from './pages/NoMatch'
import  { InboxLayout, ReceivedMessagesList, ReceivedMessageDetails, SentMessagesList, SentMessageDetails } from './widgets/inbox'


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
      { index: true, element: <ReceivedMessagesList /> },
      { path: "/messages/:messageId", element: <ReceivedMessageDetails /> },
      { path: "/sent/:messageId", element: <SentMessageDetails /> },
      { path: "sent", element: <SentMessagesList /> },
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
