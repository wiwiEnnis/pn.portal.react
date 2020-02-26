import React, { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Table, Button } from 'antd';
import { merge } from 'lodash/fp';
import { PageInfo, Repository, PullRequest, UserPullRequestsArgs } from './types/github-graphql';

type QueryViewerPullNodes = Array<
  Pick<PullRequest, 'id' | 'title'> & {
    repository: Pick<Repository, 'name'>;
  }
>;
type QueryViewerPullArgs = Pick<UserPullRequestsArgs, 'after' | 'first'>;

interface QueryViewerPulls {
  viewer: {
    pullRequests: {
      pageInfo: Pick<PageInfo, 'endCursor' | 'hasNextPage'>;
      nodes: QueryViewerPullNodes;
    };
  };
}

const QUERY_VIEWER_PULLS = gql`
  query viewerPulls($after: String, $first: Int = 1) {
    viewer {
      pullRequests(after: $after, first: $first) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          repository {
            name
          }
        }
      }
    }
  }
`;

export default function PullRequestTable() {
  const { data, loading, fetchMore } = useQuery<QueryViewerPulls, QueryViewerPullArgs>(
    QUERY_VIEWER_PULLS,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  const loadMorePullRequests = useCallback(() => {
    if (data) {
      fetchMore({
        variables: {
          after: data.viewer.pullRequests.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          return merge(fetchMoreResult, {
            viewer: {
              pullRequests: {
                nodes: [
                  ...prev.viewer.pullRequests.nodes,
                  ...fetchMoreResult!.viewer.pullRequests.nodes,
                ],
              },
            },
          });
        },
      });
    }
  }, [data, fetchMore]);

  const pullRequests = data
    ? data.viewer.pullRequests.nodes.map(o => ({
        id: o.id,
        name: o.title,
        repoName: o.repository.name,
      }))
    : [];
  const hasNextPage = data ? data.viewer.pullRequests.pageInfo.hasNextPage : false;

  return (
    <>
      <Table bordered dataSource={pullRequests} rowKey="id" pagination={false} loading={loading}>
        <Table.Column title="name" dataIndex="name" key="name" />
        <Table.Column title="repo name" dataIndex="repoName" key="repoName" />
      </Table>
      {hasNextPage && (
        <Button
          style={{ marginTop: '10px' }}
          type="primary"
          disabled={loading}
          onClick={loadMorePullRequests}
        >
          load more
        </Button>
      )}
    </>
  );
}
