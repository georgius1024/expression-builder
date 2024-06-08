import { ReactElement, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { Dropdown, Accordion, Button } from 'flowbite-react'
import { ReactSortable } from 'react-sortablejs'

import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'
import productIcon from '@assets/icons/purse.svg'
import orderIcon from '@assets/icons/order.svg'
import setupIcon from '@assets/icons/cog.svg'
import trashIcon from '@assets/icons/close.svg'
import dragIcon from '@assets/icons/drag.svg'

type ElementKey = 'events' | 'users' | 'products' | 'orders'

type Elements = { [key in ElementKey]: string[] }

type DrawerProps = {
  // show: boolean
  // onClose: () => void
  // onShow: () => void
}
export default function Drawer(_props: DrawerProps): ReactElement {
  const [show, setShow] = useState<boolean>(false)
  const [elements, setElements] = useState<Elements>({
    events: ['clicked', 'visited', 'abandoned', 'subscribed'],
    users: ['Valuable', 'New', 'Loyal', 'At risk'],
    products: ['Services', 'Fast moving', 'Out of stock', 'Discounted'],
    orders: ['Cash', 'Big', 'Credit', 'Discount']
  })

  const onClose = () => setShow(false)
  const toggle = () => setShow((show) => !show)

  const CircularButton = (
    text: string,
    icon: string,
    callback?: () => void
  ): ReactNode => {
    return (
      <button
        className="rounded-full border border-gray-400 bg-white p-3 drop-shadow"
        onClick={callback}
      >
        <img src={icon} className="size-6" alt={text} />
      </button>
    )
  }
  const Picker = (text: string, icon: string, items: string[]): ReactNode => {
    return (
      <Dropdown
        label=""
        renderTrigger={() => <span>{CircularButton(text, icon)}</span>}
      >
        {items.map((e) => (
          <Dropdown.Item key={e}>{e}</Dropdown.Item>
        ))}
      </Dropdown>
    )
  }
  const Sortable = (entry: ElementKey): ReactElement => {
    const [dragging, setDragging] = useState<boolean>(false)
    const updateElements = (key: ElementKey, items: string[]) => {
      setElements({ ...elements, [key]: items })
    }
    const list = elements[entry] as string[]
    type EntryType = { id: string; name: string }
    const onUpdateEvents = (list: EntryType[]): void => {
      updateElements(entry, list.map((e) => e.name) as string[])
    }
    const removeElement = (id: string) => {
      if (confirm(`Delete ${id}?`)) {
        updateElements(
          entry,
          elements[entry].filter((e) => e !== id) as string[]
        )
      }
    }

    const addElement = () => {
      const text = prompt('Enter new element:')
      if (text) {
        updateElements(
          entry,
          [...elements[entry], text]
        )
      }
    }

    const editElement = (item: string) => {
      const text = prompt('Enter new text:', item)
      if (text) {
        updateElements(
          entry,
          elements[entry].map(e => e === item ? text : e)
        )
      }
    }
    return (
      <>
        <ReactSortable
          handle=".handle"
          className={classNames(
            'flex flex-col py-0 text-gray-700',
            'text-sm font-medium text-gray-900 dark:text-white',
            {
              'bg-gray-100': dragging,
              'bg-white': !dragging
            },
            'transition-all duration-200 ease-linear'
          )}
          list={list.map((e) => ({ id: e, name: e }))}
          setList={onUpdateEvents}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        >
          {list.map((e) => {
            return (
              <div
                className={classNames(
                  'flex select-none flex-row items-center gap-2',
                  'border-gray-200 px-4 py-2 dark:border-gray-600',
                  'hover:bg-gray-50',
                  'border-b'
                )}
                key={e}
              >
                <div className="grow text-left cursor-pointer hover:underline" onClick={() => editElement(e)}>{e}</div>
                <img
                  src={trashIcon}
                  className="size-5 cursor-pointer"
                  alt=""
                  onClick={() => removeElement(e)}
                />
                <img src={dragIcon} className="handle size-5 cursor-pointer" />
              </div>
            )
          })}
        </ReactSortable>
        <Button size="xs" outline className="w-20 mx-auto my-4" onClick={addElement}>
          Add
        </Button>
      </>
    )
  }

  return (
    <>
      <div
        className={classNames('fixed z-10 backdrop-blur-sm', {
          'inset-0': show
        })}
        onClick={onClose}
      />
      <aside
        className={classNames(
          'absolute bottom-0 top-0 z-30 bg-transparent',
          {
            'left-0': show,
            '-left-60': !show
          },
          'transition-all duration-200 ease-linear'
        )}
      >
        <div className="flex h-full flex-row justify-stretch">
          <div className="w-60 grow border-r-2 border-gray-300 bg-white p-2 text-left">
            <div className="mb-4 h-7 overflow-hidden text-right">
              <span
                className="cursor-pointer rounded-full text-4xl text-gray-600"
                onClick={onClose}
              >
                &times;
              </span>
            </div>
            <Accordion collapseAll>
              <Accordion.Panel>
                <Accordion.Title className="px-4 py-2 focus:ring-0">
                  <p className="text-lg font-bold">Events</p>
                </Accordion.Title>
                <Accordion.Content className="p-0">
                  {Sortable('events')}
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title className="px-4 py-2 focus:ring-0">
                  <p className="text-lg font-bold">Users</p>
                </Accordion.Title>
                <Accordion.Content className="p-0">
                  {Sortable('users')}
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title className="px-4 py-2 focus:ring-0">
                  <p className="text-lg font-bold">Products</p>
                </Accordion.Title>
                <Accordion.Content className="p-0">
                  {Sortable('products')}
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title className="px-4 py-2 focus:ring-0">
                  <p className="text-lg font-bold">Orders</p>
                </Accordion.Title>
                <Accordion.Content className="p-0">
                  {Sortable('orders')}
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          </div>
          <section className="flex w-fit flex-col justify-between gap-2 bg-transparent p-2">
            <section className="flex w-fit flex-col gap-2">
              {Picker('event', eventIcon, elements.events)}
              {Picker('user', userIcon, elements.users)}
              {Picker('product', productIcon, elements.products)}
              {Picker('order', orderIcon, elements.orders)}
            </section>
            {CircularButton('setup', setupIcon, toggle)}
          </section>
        </div>
      </aside>
    </>
  )
}
