import * as React from "react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { Progress } from "./progress";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

/**
 * Example usage of display components
 * This file demonstrates how to use Alert, Badge, Skeleton, and Progress components
 */
export function DisplayComponentsExample() {
  return (
    <div className="space-y-6 p-6">
      {/* Alert Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert message.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your expense has been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              You are approaching your budget limit.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Badge Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Component</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Skeleton Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-2">Low Progress (25%)</p>
            <Progress value={25} showLabel />
          </div>
          <div>
            <p className="text-sm mb-2">Medium Progress (50%)</p>
            <Progress value={50} showLabel />
          </div>
          <div>
            <p className="text-sm mb-2">High Progress (85%)</p>
            <Progress value={85} showLabel />
          </div>
          <div>
            <p className="text-sm mb-2">Default Variant (75%)</p>
            <Progress value={75} variant="default" showLabel />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
