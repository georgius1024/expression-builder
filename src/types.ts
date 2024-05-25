export type RuleId = string

export type Rule = {
  id: RuleId
  field: string
  expression: string
  value: string | number
}

export type GroupId = string
export type Operator = 'and' | 'or'
export type Group = {
  id: GroupId
  operator: Operator 
  rules: Rule[]
  groups: Group[]
}

export type AddRuleEvent = () => void
export type AddGroupEvent = () => void
export type UpdateRuleEvent = (rule: Rule) => void
export type UpdateGroupEvent = (group: Group) => void
export type RemoveRuleEvent = (id: RuleId) => void
export type RemoveGroupEvent = (id: GroupId) => void
