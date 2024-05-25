import { ReactElement } from "react";

import type { Rule, Group, AddRuleEvent, UpdateRuleEvent, RemoveRuleEvent, UpdateGroupEvent, RemoveGroupEvent, AddGroupEvent, } from './types';
import RuleEditor from './RuleEditor';
import GroupEditor from './GroupEditor';

type RulesListProps = {
  rules: Rule[];
  groups: Group[];
  onUpdateRule: UpdateRuleEvent;
  onRemoveRule: RemoveRuleEvent;
  onAddRule: AddRuleEvent;
  onUpdateGroup: UpdateGroupEvent;
  onRemoveGroup: RemoveGroupEvent;
  onAddGroup: AddGroupEvent;
};

export default function RulesList(props: RulesListProps): ReactElement {

  return (<div className="rules-list">
    {
      props.rules.map(rule => (
        <div className="rule-item">
          <RuleEditor rule={rule} onUpdate={props.onUpdateRule} />
          <span className="remove" onClick={() => props.onRemoveRule(rule.id)}>&times;</span>
        </div>
      ))
    }
    {
      props.groups.map(group => (
        <div className="rule-item">
          <GroupEditor group={group} onUpdate={props.onUpdateGroup} />
          <span className="remove" onClick={() => props.onRemoveGroup(group.id)}>&times;</span>
        </div>
      ))
    }
    <div className="actions">
      <button className="add add-rule" onClick={props.onAddRule}>Add rule</button>
      <button className="add add-group" onClick={props.onAddGroup}>Add group</button>
    </div>
  </div>);
}
