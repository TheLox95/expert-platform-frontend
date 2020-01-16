import React from 'react';
import { GlobalStateProvider, useGlobalState } from "./state";
import { Overlay, Spinner } from "@blueprintjs/core";
import Header from './components/app/header';
import Main from './components/app/main';
import Footer from './components/app/footer';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";

const LoadComponent = () => {
  const [ isLoading ] = useGlobalState("loading");
  return isLoading === true ? (
    <Overlay isOpen={isLoading}>
      <Spinner className={'center-spinner'} />
    </Overlay>
  ) : null;
}

function App() {

  return (
    <GlobalStateProvider>
      <Router>
        <div className="flex-container">
          <LoadComponent/>
          <Header/>
          <Main />
          <Footer />
        </div>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
