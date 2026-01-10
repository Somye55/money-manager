import React from "react";
import { useScreenshot } from "../context/ScreenshotContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Capacitor } from "@capacitor/core";

const ScreenshotListenerSettings = () => {
  const {
    isListening,
    hasPermission,
    error,
    startListener,
    stopListener,
    requestPermissions,
  } = useScreenshot();

  if (!Capacitor.isNativePlatform()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera size={20} />
            Screenshot Expense Detection
          </CardTitle>
          <CardDescription>
            This feature is only available on Android devices
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera size={20} />
          Screenshot Expense Detection
        </CardTitle>
        <CardDescription>
          Automatically detect expenses from payment app screenshots using OCR
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Listener Status</span>
          <div className="flex items-center gap-2">
            {isListening ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Active
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Inactive</span>
              </>
            )}
          </div>
        </div>

        {/* Permission Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Storage Permission</span>
          <div className="flex items-center gap-2">
            {hasPermission ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Granted
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-orange-500" />
                <span className="text-sm text-orange-600 dark:text-orange-400">
                  Not Granted
                </span>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-2">
          {!hasPermission && (
            <Button
              onClick={requestPermissions}
              className="w-full"
              variant="outline"
            >
              Grant Storage Permission
            </Button>
          )}

          {hasPermission && !isListening && (
            <Button
              onClick={startListener}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Start Screenshot Listener
            </Button>
          )}

          {isListening && (
            <Button
              onClick={stopListener}
              className="w-full"
              variant="destructive"
            >
              Stop Screenshot Listener
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <strong>How it works:</strong> When you take a screenshot of a
            payment app (GPay, PhonePe, etc.), the app will automatically detect
            the expense amount and merchant using OCR, then show a popup to
            categorize the expense.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenshotListenerSettings;
