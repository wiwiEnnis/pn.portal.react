import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { client } from './apollo-client';
import Login from './Login';
import Home from './Home';

function App() {
  return (
    <div className="app" style={{ padding: '8px' }}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
        </BrowserRouter>
      </ApolloProvider>
    </div>
  );
}

export default App;
