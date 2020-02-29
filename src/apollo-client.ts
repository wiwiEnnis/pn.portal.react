import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { RestLink } from 'apollo-link-rest';

const cache = new InMemoryCache({});
const httpLink = new HttpLink({
  uri: 'https://api.github.com/graphql',
});
const restLink = new RestLink({
  uri: 'https://reqres.in/api',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  if (typeof token === 'string') {
    operation.setContext({
      headers: {
        Authorization: token,
      },
    });
  }

  return forward(operation);
});

export const client = new ApolloClient({
  link: from([authLink, restLink, httpLink]),
  cache,
});
