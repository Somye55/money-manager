import * as React from "react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export function TooltipExample() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 p-8">
        <h2 className="text-xl font-semibold">Tooltip Examples</h2>

        {/* Basic Tooltip */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Basic:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Tooltip with different sides */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Top:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Top</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Tooltip on top</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Right:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Bottom:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Tooltip on bottom</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Left:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Icon button with tooltip */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Icon:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Help">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get help</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Tooltip with longer content */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-32">Long text:</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">Info</Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                This is a longer tooltip with more detailed information that
                spans multiple lines.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
