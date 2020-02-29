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
    first: number | null
    endCursor: string | null;
    hasNextPage: boolean;
    repos: QueryViewerStaredRepoNodes;
  }

  const [state, setState] = useState<RespositoryTableState>({
    after: null,
    first: 5,
    endCursor: null,
    hasNextPage: false,
    repos: [],
  });

  const { data, loading } = useQuery<QueryViewerStaredRepos, QueryViewerStaredReposArgs>(
    QUERY_VIEWER_STARED_REPOS,
    { variables: { after: state.after, first: state.first } },
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

  const loadMore = (first?: number) => {
    if (data) {
      const { endCursor } = data.viewer.starredRepositories.pageInfo;
      setState(prev => ({ ...prev, after: endCursor || null, first: first || 5 }));
    }
  }

  const onLoad5MoreClick = useCallback(() => loadMore(5), [data]);
  const onLoad10MoreClick = useCallback(() => loadMore(10), [data])

  return (
    <>
      <Table bordered dataSource={state.repos} rowKey="id" pagination={false} loading={loading}>
        <Table.Column title="name" dataIndex="name" key="name" />
        <Table.Column title="description" dataIndex="description" key="description" />
      </Table>
      {state.hasNextPage && (
        <Button style={{ marginTop: '10px' }} type="primary" disabled={loading} onClick={onLoad5MoreClick}>
          load 5 more
        </Button>
      )}
      {state.hasNextPage && (
        <Button style={{ marginTop: '10px', marginLeft: '10px' }} type="primary" disabled={loading} onClick={onLoad10MoreClick}>
          load 10 more
        </Button>
      )}
    </>
  );
}
