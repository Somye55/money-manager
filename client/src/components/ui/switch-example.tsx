import * as React from "react";
import { Switch } from "./switch";

export function SwitchExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Switch
          id="example-switch"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <label htmlFor="example-switch" className="text-sm font-medium">
          Enable notifications
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="disabled-switch" disabled />
        <label
          htmlFor="disabled-switch"
          className="text-sm font-medium text-muted-foreground"
        >
          Disabled switch
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="checked-switch" defaultChecked />
        <label htmlFor="checked-switch" className="text-sm font-medium">
          Default checked
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        Current state: {checked ? "On" : "Off"}
      </p>
    </div>
  );
}
