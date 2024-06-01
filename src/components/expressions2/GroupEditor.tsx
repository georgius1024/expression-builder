import { ReactElement, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { Button, Dropdown } from 'flowbite-react'
import RuleEditor from '@/components/expressions2/RuleEditor'
import { defaultRule, defaultGroup } from '@/components/expressions2/utils'

import { ReactSortable } from 'react-sortablejs'
import trashIcon from '@assets/icons/close.svg'
import plusIcon from '@assets/icons/plus.svg'
import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'
import dragIcon from '@assets/icons/drag.svg'
import groupIcon from '@assets/icons/group.svg'

import type {
  Rule,
  Group,
  Entries,
  AddRuleEvent,
  AddGroupEvent,
  UpdateRuleEvent,
  UpdateGroupEvent,
  RemoveEntryEvent,
  EntryOperator,
  EntryId,
  Category
} from '@/components/expressions2/types'

type GroupEditorProps = {
  group: Group
  onUpdate: UpdateGroupEvent
  nested?: boolean
  onRemove?: RemoveEntryEvent
  className?: string
}

export default function GroupEditor(props: GroupEditorProps): ReactElement {
  const [dragging, setDragging] = useState<boolean>(false)
  const toggleOperator = () =>
    props.group.operator === 'and'
      ? updateOperator('or')
      : updateOperator('and')
  const updateOperator = (operator: EntryOperator) => {
    const updated = { ...props.group, operator }
    props.onUpdate(updated)
  }

  const onAddRule: AddRuleEvent = (category: Category) => {
    const updatedEntries: Entries = [
      ...props.group.entries,
      defaultRule(category)
    ]
    const updated: Group = { ...props.group, entries: updatedEntries }
    props.onUpdate(updated)
  }

  const onAddGroup: AddGroupEvent = () => {
    const updatedEntries: Entries = [...props.group.entries, defaultGroup()]
    const updated: Group = { ...props.group, entries: updatedEntries }
    props.onUpdate(updated)
  }

  const onUpdateRule: UpdateRuleEvent = (rule: Rule) => {
    const updatedEntries: Entries = props.group.entries.map((e) =>
      e.id === rule.id && e.type === 'rule' ? rule : e
    )
    const updated: Group = { ...props.group, entries: updatedEntries }
    props.onUpdate(updated)
  }

  const onUpdateGroup: UpdateGroupEvent = (group: Group) => {
    const updatedEntries: Entries = props.group.entries
      .map((e) => (e.id === group.id && e.type === 'group' ? group : e))
      .filter(
        (e) => e.type === 'rule' || (e.type === 'group' && e.entries.length > 0)
      )
    const updated: Group = { ...props.group, entries: updatedEntries }
    props.onUpdate(updated)
  }

  const onRemoveEntry: RemoveEntryEvent = (id: EntryId) => {
    const updatedEntries: Entries = props.group.entries.filter(
      (e) => e.id !== id
    )
    const updated: Group = { ...props.group, entries: updatedEntries }
    props.onUpdate(updated)
  }

  const onUpdateOrder = (entries: Entries): void => {
    const updated: Group = { ...props.group, entries: [...entries] }
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
          'rounded-md border-s-2 border-solid border-gray-500 py-1 ps-2':
            props.nested
        },

        props.className
      )}
    >
      <div className="flex flex-row gap-2">
        {/* <Button outline size="xs" className="w-10" onClick={toggleOperator}>
          {props.group.operator === 'and' ? 'AND' : 'OR'}
        </Button> */}

        <Dropdown
          label=""
          renderTrigger={() => (
            <Button outline pill size="xs">
              <img src={plusIcon} className="size-4" />
            </Button>
          )}
        >
          <Dropdown.Header>
            <div className="text-md text-left font-bold">Add</div>
          </Dropdown.Header>

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

          <Dropdown.Divider />

          <Dropdown.Item onClick={onAddGroup}>
            <div className="flex flex-row items-center gap-2">
              <img src={groupIcon} className="size-4" />
              Nested group
            </div>
          </Dropdown.Item>
        </Dropdown>

        <div className="grow" />
        {props.nested && (
          <img
            src={dragIcon}
            className="handle mx-2 w-6 cursor-pointer"
          />
        )}
      </div>

      <ReactSortable
        handle=".handle"
        className={classNames('flex flex-col gap-4 py-0', {
          'bg-gray-100 py-4': dragging
        },
      'transition-all ease-linear duration-200')}
        list={props.group.entries}
        setList={onUpdateOrder}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      >
        {props.group.entries.map((e) => {
          if (e.type === 'rule') {
            return (
              <div className="flex flex-row items-center gap-2" key={e.id}>
                <RuleEditor rule={e} onUpdate={onUpdateRule} className="grow" />
                <RemoveWidget onClick={() => onRemoveEntry(e.id)} />
                <img
                  src={dragIcon}
                  className="handle mx-2 w-6 cursor-pointer"
                />
              </div>
            )
          }
          if (e.type === 'group') {
            return (
              <div className="flex flex-row items-center gap-2" key={e.id}>
                <GroupEditor
                  group={e}
                  onUpdate={onUpdateGroup}
                  onRemove={() => onRemoveEntry(e.id)}
                  nested
                  className="grow"
                />
              </div>
            )
          }
        })}
      </ReactSortable>
    </div>
  )
}
