export type EntryId = string

type RuleType = 'rule'
type GroupType = 'group'
export type EntryType = RuleType | GroupType
export type EntryOperator = 'and' | 'or'

export type Entry<T extends EntryType> = {
  id: EntryId
  type: T
  operator: EntryOperator
}

export type Field = string
export type Expression = string
export type Value = string | number | string[] | number[]
export type Category = 'user' | 'event'

export type Rule = Entry<RuleType> & {
  category: Category
  not: boolean
  field: Field
  expression: Expression
  value: Value
}

export type Group = Entry<GroupType> & { entries: Entries }

export type Entries = (Rule | Group)[]

export type AddRuleEvent = (category: Category) => void
export type AddGroupEvent = () => void

export type UpdateRuleEvent = (rule: Rule) => void
export type UpdateGroupEvent = (group: Group) => void

export type RemoveEntryEvent = (id: EntryId) => void
