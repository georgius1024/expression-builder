export type RuleId = string

export type Rule = {
  id: RuleId
  field: string
  expression: string
  value: string | number
}

export type GroupId = string

export type Group = {
  id: GroupId
  operator: 'and' | 'or'
  rules: Rule[]
  groups: Group[]
}

export type AddRuleEvent = () => void
export type AddGroupEvent = () => void
export type UpdateRuleEvent = (rule: Rule) => void
export type UpdateGroupEvent = (group: Group) => void
export type RemoveRuleEvent = (id: RuleId) => void
export type RemoveGroupEvent = (id: GroupId) => void
