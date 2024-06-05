import React from "react";

//modified App.jsx to help all requests work with Apollo server
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";


import { setContext } from "@apollo/client/link/context";

import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

//need to create link because we are now using graphql
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    //provider wrapping all logic 
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
      </ApolloProvider>
  );
}

export default App;
