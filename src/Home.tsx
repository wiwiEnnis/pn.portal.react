import React, { useState } from 'react';
import { Tabs } from 'antd';
import RepositoryTable from './RepositoryTable';
import PullRequestTable from './PullRequestTable';
import RestUserTable from './RestUserTable';

export default function Home() {
  const [state, setState] = useState({ activeKey: 'repo' });

  return (
    <div className="home">
      <Tabs
        defaultActiveKey="repo"
        onChange={key => setState(prev => ({ ...prev, activeKey: key }))}
      >
        <Tabs.TabPane tab="My Repos" key="repo">
          {state.activeKey === 'repo' && <RepositoryTable />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Pulls" key="pull">
          {state.activeKey === 'pull' && <PullRequestTable />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Users" key="user">
          {state.activeKey === 'user' && <RestUserTable />}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
