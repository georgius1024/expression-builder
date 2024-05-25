import { ReactElement } from "react";

import type { Rule, Group, AddRuleEvent, UpdateRuleEvent, RemoveRuleEvent, } from './types';
import RuleEditor from './RuleEditor';

type RulesListProps = {
  rules: Rule[];
  groups: Group[];
  onUpdateRule: UpdateRuleEvent;
  onRemoveRule: RemoveRuleEvent;
  onAddRule: AddRuleEvent;
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
    <button className="add add-rule" onClick={props.onAddRule}>Add rule</button>
  </div>);
}
