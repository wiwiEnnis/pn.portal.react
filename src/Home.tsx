import React, { useState } from 'react';
import { Tabs } from 'antd';
import RepositoryTable from './RepositoryTable';
import PullRequestTable from './PullRequestTable';

export default function Home() {
  const [state, setState] = useState({ activeKey: 'pull' });

  return (
    <div className="home">
      <Tabs
        defaultActiveKey="pull"
        onChange={key => setState(prev => ({ ...prev, activeKey: key }))}
      >
        <Tabs.TabPane tab="My Repos" key="repo">
          {state.activeKey === 'repo' && <RepositoryTable />}
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Pulls" key="pull">
          {state.activeKey === 'pull' && <PullRequestTable />}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
