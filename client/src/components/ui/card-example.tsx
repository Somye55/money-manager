/**
 * Card Component Usage Examples
 *
 * This file demonstrates how to use the Card component with its sections.
 * Delete this file after reviewing the examples.
 */

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "./button";

// Example 1: Basic Card with all sections
export function BasicCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
}

// Example 2: Interactive Card with hover effect
export function InteractiveCardExample() {
  return (
    <Card interactive onClick={() => console.log("Card clicked")}>
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Click me to see the hover effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover states and is clickable.</p>
      </CardContent>
    </Card>
  );
}

// Example 3: Card with only header and content
export function SimpleCardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card doesn't have a footer.</p>
      </CardContent>
    </Card>
  );
}

// Example 4: Card with custom styling
export function CustomStyledCardExample() {
  return (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
      <CardHeader>
        <CardTitle>Custom Styled Card</CardTitle>
        <CardDescription className="text-white/80">
          With gradient background
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card uses custom Tailwind classes for styling.</p>
      </CardContent>
    </Card>
  );
}
