import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    const token = localStorage.getItem('token');

    if (typeof token === 'string') {
      operation.setContext({
        headers: {
          Authorization: token,
        },
      });
    }
  },
});
