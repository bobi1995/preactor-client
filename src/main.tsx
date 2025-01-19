import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/config.js";
import MainRouter from "./router/MainRouter";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphql/client.js";
import { ToastContainer } from "react-toastify";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <StrictMode>
      <ToastContainer />
      <MainRouter />
    </StrictMode>
  </ApolloProvider>
);
