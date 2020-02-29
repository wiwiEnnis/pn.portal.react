import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Table, Button } from 'antd';

interface QueryRestUsers {
  users: {
    total_pages: number;
    data: Array<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      avatar: string;
    }>;
  };
}

interface QueryRestUsersArgs {
  page: number;
}

const QUERY_REST_USERS = gql`
  query queryRestUsers($page: Int = 1) {
    users(page: $page) @rest(type: "Users", path: "/users?page={args.page}") {
      total_pages
      data @type(name: "User") {
        id
        email
        first_name
        last_name
        avatar
      }
    }
  }
`;

export default function RestUserTable() {
  interface RestUserTableState {
    page: number;
  }

  const [state, setState] = useState<RestUserTableState>({
    page: 1,
  });

  const { data, loading } = useQuery<QueryRestUsers, QueryRestUsersArgs>(QUERY_REST_USERS, {
    variables: {
      page: state.page,
    },
  });

  let users: QueryRestUsers['users']['data'] = [];
  let totalPage: number = 0;
  let hasNextPage = false;
  let hasPrevPage = false;

  if (data) {
    users = data.users.data;
    totalPage = data.users.total_pages;
    hasNextPage = totalPage > state.page;
    hasPrevPage = state.page > 1;
  }

  const onNextPageClick = () => {
    if (state.page >= totalPage) {
      return;
    }

    setState(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const onPrevPageClick = () => {
    if (state.page === 1) {
      return;
    }

    setState(prev => ({ ...prev, page: prev.page - 1 }));
  };

  const NameColumn = (
    <Table.Column
      title="name"
      key="name"
      render={record => `${record.first_name} ${record.last_name}`}
    />
  );

  const EmailColumn = <Table.Column title="email" dataIndex="email" key="email" />;

  const NextPageButton = () => {
    if (hasPrevPage) {
      return (
        <Button
          style={{ marginTop: '10px', marginRight: '10px' }}
          type="primary"
          disabled={loading}
          onClick={onPrevPageClick}
        >
          prev
        </Button>
      );
    }

    return null;
  };

  const PrevPageButton = () => {
    if (hasNextPage) {
      return (
        <Button
          style={{ marginTop: '10px' }}
          type="primary"
          disabled={loading}
          onClick={onNextPageClick}
        >
          next
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <Table bordered dataSource={users} rowKey="id" pagination={false} loading={loading}>
        {NameColumn}
        {EmailColumn}
      </Table>
      <NextPageButton />
      <PrevPageButton />
    </>
  );
}
