import { ReactElement, ReactNode, useState } from 'react'
import classNames from 'classnames'
import { Dropdown } from 'flowbite-react'

import eventIcon from '@assets/icons/radar.svg'
import userIcon from '@assets/icons/account.svg'
import productIcon from '@assets/icons/purse.svg'
import orderIcon from '@assets/icons/order.svg'
import setupIcon from '@assets/icons/cog.svg'

type DrawerProps = {
  // show: boolean
  // onClose: () => void
  // onShow: () => void
}
export default function Drawer(_props: DrawerProps): ReactElement {
  const [show, setShow] = useState<boolean>(false)

  const onClose = () => setShow(false)
  const onShow = () => setShow(true)
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
          <div className="w-60 grow border-r-2 border-gray-300 bg-white">
            <div className="h-7 overflow-hidden text-right">
              <span
                className="cursor-pointer rounded-full p-2 text-4xl text-gray-600"
                onClick={onClose}
              >
                &times;
              </span>
            </div>
            {show.toString()}
          </div>
          <section className="flex w-fit flex-col justify-between gap-2 bg-transparent p-2">
            <section className="flex w-fit flex-col gap-2">
              {Picker('event', eventIcon, ['clicked', 'visited', 'abandoned', 'subscribed'])}
              {Picker('user', userIcon, ['Valuable', 'New',  'Loayal', 'At risk'])}
              {Picker('product', productIcon, ['Services', 'Fast moving', 'Out of stock', 'Discounted'])}
              {Picker('order', orderIcon, ['Cash', 'Big', 'Credit', 'Discount'])}
            </section>
            {CircularButton('setup', setupIcon, toggle)}
          </section>
        </div>
      </aside>
    </>
  )
}
