import { useState } from "react";

import "./App.scss";
import type { Group } from "@/components/expressions/types";
import GroupEditor from "@/components/expressions/GroupEditor";
import {
  defaultGroup,
  getGroupExpression,
} from "./components/expressions/utils";

function App() {
  const [root, updateRoot] = useState<Group>(defaultGroup());

  return (
    <>
      <h1>Rules editor</h1>
      <GroupEditor
        group={root}
        onUpdate={updateRoot}
      />
      <div className="expression">{getGroupExpression(root)}</div>
    </>
  );
}

export default App;
