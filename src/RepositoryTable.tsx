import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Table, Button } from 'antd';
import { Repository, UserStarredRepositoriesArgs, PageInfo } from './types/github-graphql';

type QueryViewerStaredRepoNodes = Pick<Repository, 'id' | 'name' | 'description'>[];
type QueryViewerStaredReposArgs = Pick<UserStarredRepositoriesArgs, 'after' | 'first'>;
interface QueryViewerStaredRepos {
  viewer: {
    starredRepositories: {
      nodes: QueryViewerStaredRepoNodes;
      pageInfo: Pick<PageInfo, 'endCursor' | 'hasNextPage'>;
    };
  };
}

const QUERY_VIEWER_STARED_REPOS = gql`
  query viewerStaredRepos($after: String, $first: Int = 5) {
    viewer {
      starredRepositories(after: $after, first: $first) {
        nodes {
          id
          name
          description
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export default function RespositoryTable() {
  interface RespositoryTableState {
    after: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    repos: QueryViewerStaredRepoNodes;
  }

  const [state, setState] = useState<RespositoryTableState>({
    after: null,
    endCursor: null,
    hasNextPage: false,
    repos: [],
  });

  const { data, loading } = useQuery<QueryViewerStaredRepos, QueryViewerStaredReposArgs>(
    QUERY_VIEWER_STARED_REPOS,
    { variables: { after: state.after } },
  );

  useEffect(() => {
    if (data) {
      const { nodes } = data.viewer.starredRepositories;
      const { endCursor, hasNextPage } = data.viewer.starredRepositories.pageInfo;
      setState(prev => ({
        ...prev,
        endCursor: endCursor || null,
        hasNextPage,
        repos: [...prev.repos, ...nodes],
      }));
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (data) {
      const { endCursor } = data.viewer.starredRepositories.pageInfo;
      setState(prev => ({ ...prev, after: endCursor || null }));
    }
  }, [data]);

  return (
    <>
      <Table bordered dataSource={state.repos} rowKey="id" pagination={false} loading={loading}>
        <Table.Column title="name" dataIndex="name" key="name" />
        <Table.Column title="description" dataIndex="description" key="description" />
      </Table>
      {state.hasNextPage && (
        <Button disabled={loading} onClick={loadMore}>
          load more
        </Button>
      )}
    </>
  );
}
