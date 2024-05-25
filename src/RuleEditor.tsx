import { ReactElement, ChangeEvent } from "react";

import type { Rule, UpdateRuleEvent } from './types';

type RuleEditorProps = {
  rule: Rule;
  onUpdate: UpdateRuleEvent;
};

export default function RuleEditor(props: RuleEditorProps): ReactElement {
  const updateField = (field: 'field' | 'expression' | 'value', e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    const updated = { ...props.rule, [field]: value };
    props.onUpdate(updated);
  };
  return (<div className="rule-editor">
    <select value={props.rule.field} onChange={(e) => updateField('field', e)}>
      <option value="">Field</option>
      <option value="name">Name</option>
      <option value="age">Age</option>
    </select>
    <select value={props.rule.expression} onChange={(e) => updateField('expression', e)}>
      <option value="">Expression</option>
      <option value="=">Equal</option>
      <option value="!=">Not equal</option>
    </select>
    <input value={props.rule.value} onChange={(e) => updateField('value', e)} />
  </div>);
}
