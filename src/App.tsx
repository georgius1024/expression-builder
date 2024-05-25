import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import './App.scss';
import type {Group,  Rule, } from './types';
import GroupEditor from './GroupEditor';

function getRuleExpression(rule: Rule): string {
  return `${rule.field} ${rule.expression} ${rule.value}`;
}

function getGroupExpression(group: Group): string {
  return [
    ...group.rules.map(getRuleExpression),
    ...group.groups.map(getGroupExpression)
  ].map(e => `(${e})`).join(` ${group.operator} `)
}

function App() {
  const [root, updateRoot] = useState<Group | undefined>(undefined);
  useEffect(() => {
    const root: Group = {
      id: 'root',
      operator: 'and',
      rules: [{
        id: nanoid(),
        field: '',
        expression: '',
        value: ''
      }],
      groups: []
    };
    updateRoot(root);
  }, []);
  if (!root) return // Nothing to render without root
  return (
    <>
      <h1>Rules editor</h1>
      <GroupEditor group={root} onUpdate={updateRoot} />
      <div className='expression'>
        {
          getGroupExpression(root)
        }
      </div>
    </>
  );
}

export default App;
