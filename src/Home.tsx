import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button, Table } from 'antd';

interface RepoNode {
  id: string;
  name: string;
  description: string;
}

interface ViewerStaredRepos {
  viewer: {
    starredRepositories: {
      nodes: RepoNode[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

const VIEWER_STARED_REPOS_QUERY = gql`
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

function RespositoryTable(props: {
  nodes: ViewerStaredRepos['viewer']['starredRepositories']['nodes'];
}) {
  return (
    <Table bordered dataSource={props.nodes} rowKey="id" pagination={false}>
      <Table.Column title="name" dataIndex="name" key="name" />
      <Table.Column title="description" dataIndex="description" key="description" />
    </Table>
  );
}

export default function Home() {
  const history = useHistory();
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const { data, loading, error } = useQuery<ViewerStaredRepos>(VIEWER_STARED_REPOS_QUERY, {
    variables: { after },
  });

  useEffect(() => {
    if (error) {
      history.push('/login');
      return;
    }

    if (data) {
      const { hasNextPage } = data.viewer.starredRepositories.pageInfo;
      const newNodes = data.viewer.starredRepositories.nodes;

      setHasNextPage(hasNextPage);
      setNodes([...nodes, ...newNodes]);
    }
  }, [data, history, error]);

  const loadMore = useCallback(() => {
    if (data) {
      const { endCursor } = data.viewer.starredRepositories.pageInfo;

      setAfter(endCursor);
    }
  }, [data]);

  return (
    <div className="home">
      <RespositoryTable nodes={nodes} />
      {nodes.length && hasNextPage && (
        <Button type="primary" disabled={loading} onClick={loadMore}>
          load more
        </Button>
      )}
    </div>
  );
}
