import { ReactElement } from "react";

import RulesList from './RulesList';
import { nanoid } from 'nanoid';

import type { Rule, Group, AddRuleEvent, UpdateRuleEvent, RemoveRuleEvent, UpdateGroupEvent, RemoveGroupEvent, AddGroupEvent, Operator, RuleId, GroupId } from './types';

const emptyRule = (): Rule => ({
  id: nanoid(),
  field: '',
  expression: '',
  value: ''
})

type GroupEditorProps = {
  group: Group;
  onUpdate: UpdateGroupEvent;
};

export default function GroupEditor(props: GroupEditorProps): ReactElement {
  const updateOperator = (operator: Operator) => {
    const updated = { ...props.group, operator };
    props.onUpdate(updated);
  };
  const onUpdateRule: UpdateRuleEvent = (rule: Rule) => {
    const updatedRules = props.group.rules.map(e =>
      e.id === rule.id ? rule : e
    );
    const updated: Group = { ...props.group, rules: updatedRules };
    props.onUpdate(updated);
  };

  const onAddRule: AddRuleEvent = () => {
    const updatedRules = [...props.group.rules, emptyRule()];
    const updated: Group = { ...props.group, rules: updatedRules };
    props.onUpdate(updated);
  };

  const onRemoveRule: RemoveRuleEvent = (id: RuleId) => {
    const updatedRules = props.group.rules.filter(e => e.id !== id);
    const updated: Group = { ...props.group, rules: updatedRules };
    props.onUpdate(updated);
  };

  const onAddGroup: AddGroupEvent = () => {
    const updatedGroups: Group[] = [...props.group.groups, {
      id: nanoid(),
      operator: 'and',
      rules: [emptyRule()],
      groups: []
    }];
    const updated: Group = { ...props.group, groups: updatedGroups };
    props.onUpdate(updated);
  };

  const onUpdateGroup: UpdateGroupEvent = (group: Group) => {
    const updatedGroups = props.group.groups.map(e =>
      e.id === group.id ? group : e
    );
    const updated: Group = { ...props.group, groups: updatedGroups };
    props.onUpdate(updated);
  };

  const onRemoveGroup: RemoveGroupEvent = (id: GroupId) => {
    const updatedGroups = props.group.groups.filter(e => e.id !== id);
    const updated: Group = { ...props.group, groups: updatedGroups };
    props.onUpdate(updated);
  }
  return (
    <div className="group-editor">
      <div className="operator-editor">
        <input type="radio" id={`and-${props.group.id}`} value="and" checked={props.group.operator === 'and'} onChange={() => updateOperator('and')} />
        <label htmlFor={`and-${props.group.id}`}>And</label>
        <input type="radio" id={`or-${props.group.id}`} name="operator" value="or" checked={props.group.operator === 'or'} onChange={() => updateOperator('or')} />
        <label htmlFor={`or-${props.group.id}`}>Or</label>
      </div>
      <RulesList rules={props.group.rules} groups={props.group.groups}
        onAddRule={onAddRule} onUpdateRule={onUpdateRule} onRemoveRule={onRemoveRule} 
        onAddGroup={onAddGroup} onUpdateGroup={onUpdateGroup} onRemoveGroup={onRemoveGroup}/>
    </div >
  );
}