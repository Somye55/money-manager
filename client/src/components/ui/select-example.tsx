import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

export function SelectExample() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Select a category
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="food">🍔 Food</SelectItem>
              <SelectItem value="transport">🚗 Transport</SelectItem>
              <SelectItem value="housing">🏠 Housing</SelectItem>
              <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
              <SelectItem value="utilities">💡 Utilities</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Select with controlled value
        </label>
        <Select defaultValue="transport">
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">🍔 Food</SelectItem>
            <SelectItem value="transport">🚗 Transport</SelectItem>
            <SelectItem value="housing">🏠 Housing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Disabled select
        </label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="This is disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">🍔 Food</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
