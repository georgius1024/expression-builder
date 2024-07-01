import { useState } from 'react'
import classNames from 'classnames'
import GroupEditor from '@/components/expressions2/GroupEditor'
// import Drawer from '@/components/Drawer'
import { getGroupExpression } from './components/expressions2/utils'
import defaultValue from '@/default-group'

import type { Group } from '@/components/expressions2/types'
import './App.scss'

function App() {
  const [root, updateRoot] = useState<Group>(defaultValue)
  const expression = getGroupExpression(root)
  return (
    <div
      className={classNames('absolute inset-0 z-0 overflow-y-auto bg-red-100')}
    >
      <div className="mx-auto my-2 w-6/12 bg-white p-5 drop-shadow-lg">
        <h1 className="mb-2 text-left text-2xl font-bold">
          Expression builder
        </h1>
        <GroupEditor
          group={root}
          onUpdate={(root: Group) => {
            updateRoot(root)
          }}
        />
        {expression && (
          <>
            <hr className="my-2" />
            <h2 className="text-l text-left font-bold">
              SQL output will be like
            </h2>
            <div className="font-mono whitespace-pre-wrap text-left text-sm">
              {expression}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
