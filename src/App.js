import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import LoginPage from "./containers/LoginPage";
import DashboardPage from "./containers/DashboardPage";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <HashRouter>
        <Route path="/" exact component={DashboardPage} />
        <Route path="/login" component={LoginPage} />
      </HashRouter>
    </SnackbarProvider>
  );
}

export default App;
