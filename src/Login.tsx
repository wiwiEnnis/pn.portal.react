import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'qs';

export default function Login(): JSX.Element {
  const { replace } = useHistory();
  const { search } = useLocation();
  const parsedSearch: { token_type?: string; access_token?: string } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  const { token_type, access_token } = parsedSearch;

  if (parsedSearch.token_type && parsedSearch.access_token) {
    localStorage.setItem('token', `${token_type} ${access_token}`);
    replace('/');
  }

  return (
    <div>
      <a href="https://github.com/login/oauth/authorize?client_id=1921cbd6e62842123d88&scope=user,public_repo,repo,repo_deployment,repo:status,read:repo_hook,read:org,read:public_key,read:gpg_key">
        github OAuth
      </a>
    </div>
  );
}
