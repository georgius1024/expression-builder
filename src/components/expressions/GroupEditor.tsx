import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import { Button, Dropdown } from 'flowbite-react'
import { defaultRule, defaultGroup } from '@/components/expressions/utils'
import trashIcon from '@assets/icons/close.svg'
import plusIcon from '@assets/icons/plus.svg'
import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'

import RuleEditor from '@/components/expressions/RuleEditor'

import type {
  Rule,
  Group,
  AddRuleEvent,
  UpdateRuleEvent,
  RemoveRuleEvent,
  UpdateGroupEvent,
  RemoveGroupEvent,
  AddGroupEvent,
  Operator,
  RuleId,
  GroupId,
  Category
} from '@/components/expressions/types'

type GroupEditorProps = {
  group: Group
  onUpdate: UpdateGroupEvent
  nested?: boolean
  onRemove?: RemoveGroupEvent
  className?: string
}

export default function GroupEditor(props: GroupEditorProps): ReactElement {
  const toggleOperator = () =>
    props.group.operator === 'and'
      ? updateOperator('or')
      : updateOperator('and')
  const updateOperator = (operator: Operator) => {
    const updated = { ...props.group, operator }
    props.onUpdate(updated)
  }
  const onUpdateRule: UpdateRuleEvent = (rule: Rule) => {
    const updatedRules = props.group.rules.map((e) =>
      e.id === rule.id ? rule : e
    )
    const updated: Group = { ...props.group, rules: updatedRules }
    props.onUpdate(updated)
  }

  const onAddRule: AddRuleEvent = (category: Category) => {
    const updatedRules = [...props.group.rules, defaultRule(category)]
    const updated: Group = { ...props.group, rules: updatedRules }
    props.onUpdate(updated)
  }

  const onRemoveRule: RemoveRuleEvent = (id: RuleId) => {
    const updatedRules = props.group.rules.filter((e) => e.id !== id)
    const updated: Group = { ...props.group, rules: updatedRules }
    props.onUpdate(updated)
  }

  const onAddGroup: AddGroupEvent = () => {
    const updatedGroups: Group[] = [...props.group.groups, defaultGroup()]
    const updated: Group = { ...props.group, groups: updatedGroups }
    props.onUpdate(updated)
  }

  const onUpdateGroup: UpdateGroupEvent = (group: Group) => {
    const updatedGroups = props.group.groups.map((e) =>
      e.id === group.id ? group : e
    )
    const updated: Group = { ...props.group, groups: updatedGroups }
    props.onUpdate(updated)
  }

  const onRemoveGroup: RemoveGroupEvent = (id: GroupId) => {
    const updatedGroups = props.group.groups.filter((e) => e.id !== id)
    const updated: Group = { ...props.group, groups: updatedGroups }
    props.onUpdate(updated)
  }

  type OnClick = () => void

  type RemoveWidgetProps = { onClick: OnClick }
  function RemoveWidget(props: RemoveWidgetProps): ReactNode {
    return (
      <div
        className="icon-control flex place-content-center p-1"
        onClick={props.onClick}
      >
        <img src={trashIcon} className="size-5" alt="" />
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-4',
        {
          'border-s-2 border-solid border-gray-500 ps-2': props.nested
        },
        props.className
      )}
    >
      <div className="flex flex-row gap-2">
        <Button outline size="xs" className="w-10" onClick={toggleOperator}>
          {props.group.operator === 'and' ? 'AND' : 'OR'}
        </Button>

        <Dropdown
          label=""
          renderTrigger={() => (
            <Button outline size="xs">
              <img src={plusIcon} className="size-4" /> Add rule
            </Button>
          )}
        >
          <Dropdown.Item onClick={() => onAddRule('user')}>
            <div className="flex flex-row items-center gap-2">
              <img src={userIcon} className="size-4" />
              User
            </div>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => onAddRule('event')}>
            <div className="flex flex-row items-center gap-2">
              <img src={eventIcon} className="size-4" />
              Event
            </div>
          </Dropdown.Item>
        </Dropdown>

        <Button outline size="xs" onClick={onAddGroup}>
          <img src={plusIcon} className="size-4" /> Add group
        </Button>
        {props.onRemove && (
          <Button
            outline
            size="xs"
            color="failure"
            onClick={() => props.onRemove && props.onRemove(props.group.id)}
          >
            <img src={trashIcon} className="size-4" alt="" />
            Remove group
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {props.group.rules.map((rule) => (
          <div className="flex flex-row items-center gap-2" key={rule.id}>
            <RuleEditor rule={rule} onUpdate={onUpdateRule} className="grow" />
            <RemoveWidget onClick={() => onRemoveRule(rule.id)} />
          </div>
        ))}
        {props.group.groups.map((group) => (
          <div className="flex flex-row items-center gap-4" key={group.id}>
            <GroupEditor
              group={group}
              onUpdate={onUpdateGroup}
              onRemove={() => onRemoveGroup(group.id)}
              nested
              className="grow"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
