export type RuleId = string
export type Field= string
export type Expression= string
export type Value = string | number | string[] | number[]
export type Category = 'user' | 'event'
export type Rule = {
  category: Category
  id: RuleId
  not: boolean
  field: Field
  expression: Expression
  value: Value
}

export type GroupId = string
export type Operator = 'and' | 'or'
export type Group = {
  id: GroupId
  operator: Operator 
  rules: Rule[]
  groups: Group[]
}

export type AddRuleEvent = (category: Category) => void
export type AddGroupEvent = () => void
export type UpdateRuleEvent = (rule: Rule) => void
export type UpdateGroupEvent = (group: Group) => void
export type RemoveRuleEvent = (id: RuleId) => void
export type RemoveGroupEvent = (id: GroupId) => void
