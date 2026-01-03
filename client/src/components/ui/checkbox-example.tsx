import * as React from "react";
import { Checkbox } from "./checkbox";

export function CheckboxExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        Checkbox Component Examples
      </h2>

      {/* Basic Checkbox */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Basic Checkbox</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="basic" />
          <label
            htmlFor="basic"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
      </div>

      {/* Controlled Checkbox */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Controlled Checkbox</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(value) => setChecked(value as boolean)}
          />
          <label
            htmlFor="controlled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {checked ? "Checked" : "Unchecked"}
          </label>
        </div>
      </div>

      {/* Disabled Checkbox */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Disabled Checkbox</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <label
            htmlFor="disabled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Disabled checkbox
          </label>
        </div>
      </div>

      {/* Disabled Checked Checkbox */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Disabled Checked Checkbox</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled-checked" disabled checked />
          <label
            htmlFor="disabled-checked"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Disabled checked checkbox
          </label>
        </div>
      </div>

      {/* Multiple Checkboxes */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Multiple Checkboxes</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="option1" />
            <label
              htmlFor="option1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Option 1
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="option2" />
            <label
              htmlFor="option2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Option 2
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="option3" />
            <label
              htmlFor="option3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Option 3
            </label>
          </div>
        </div>
      </div>

      {/* Touch Target Verification */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          Touch Target Size (44px minimum)
        </h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Checkbox id="touch-target" />
            <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none" />
          </div>
          <label
            htmlFor="touch-target"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Checkbox with visible touch target (blue dashed border)
          </label>
        </div>
      </div>
    </div>
  );
}
