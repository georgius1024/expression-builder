import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import './App.scss';
import type { AddRuleEvent, Group, RemoveRuleEvent, Rule, RuleId, UpdateRuleEvent } from './types';
import RuleEditor from './RuleEditor';
import RulesList
 from './RulesList';
function getRuleExpression(rule: Rule): string {
  return `${rule.field} ${rule.expression} ${rule.value}`;
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
  const onUpdateRule: UpdateRuleEvent = (rule: Rule) => {
    const updatedRules = root.rules.map(e =>
      e.id === rule.id ? rule : e
    );
    const updated: Group = { ...root, rules: updatedRules };
    updateRoot(updated);
    console.log(rule);
  };

  const onAddRule: AddRuleEvent = () => {
    const updatedRules = [...root.rules, {
      id: nanoid(),
      field: '',
      expression: '',
      value: ''
    }]
    const updated: Group = { ...root, rules: updatedRules };
    updateRoot(updated);
  }

  const onRemoveRule: RemoveRuleEvent = (id: RuleId) => {
    const updatedRules = root.rules.filter(e => e.id !== id);
    const updated: Group = { ...root, rules: updatedRules };
    updateRoot(updated);
  }
  return (
    <>
      <h1>Hello there!!!</h1>
      <RulesList rules={root.rules} groups={root.groups} onAddRule={onAddRule} onUpdateRule={onUpdateRule} onRemoveRule={onRemoveRule} />
      <hr/>
      {
        root?.rules && <RuleEditor rule={root?.rules[0]} onUpdate={onUpdateRule} />
      }
      <div className='expression'>
        {
          root?.rules && getRuleExpression(root?.rules[0])
        }
      </div>
    </>
  );
}

export default App;
