import { useState, useEffect } from "react";
import { GripVertical, ArrowUpDown } from "lucide-react";
import { keyManager } from "../../lib/keyManager";
import { getProvider } from "../../lib/aiProviders";
import { useToast } from "../ui/use-toast";

/**
 * PrioritySettings Component
 *
 * Allows users to set provider priority order using drag-and-drop.
 * Only shows configured providers.
 *
 * Requirements: 5.4
 */
const PrioritySettings = ({ keyStatuses }) => {
  const [priority, setPriority] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPriority();
  }, [keyStatuses]);

  const loadPriority = async () => {
    try {
      setLoading(true);
      const currentPriority = await keyManager.getPriority();

      // Filter to only show configured providers
      const configuredProviders = currentPriority.filter(
        (providerName) => keyStatuses[providerName]?.configured,
      );

      setPriority(configuredProviders);
    } catch (error) {
      console.error("Failed to load priority:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (draggingIndex === null || draggingIndex === index) return;

    const newPriority = [...priority];
    const draggedItem = newPriority[draggingIndex];

    // Remove from old position
    newPriority.splice(draggingIndex, 1);
    // Insert at new position
    newPriority.splice(index, 0, draggedItem);

    setPriority(newPriority);
    setDraggingIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggingIndex(null);

    try {
      await keyManager.setPriority(priority);
      toast({
        title: "Priority updated",
        description: "Provider priority order has been saved",
      });
    } catch (error) {
      console.error("Failed to save priority:", error);
      toast({
        title: "Error",
        description: "Failed to save priority order",
        variant: "destructive",
      });
      // Reload priority on error
      loadPriority();
    }
  };

  // Don't show if less than 2 providers configured
  if (priority.length < 2) {
    return null;
  }

  if (loading) {
    return (
      <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up card-elevated rounded-2xl overflow-hidden bg-white dark:bg-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ArrowUpDown size={20} />
          Provider Priority
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Drag to reorder. The app will try providers in this order.
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {priority.map((providerName, index) => {
            const provider = getProvider(providerName);
            const status = keyStatuses[providerName];

            return (
              <div
                key={providerName}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border cursor-move hover:bg-secondary/50 transition-colors ${
                  draggingIndex === index ? "opacity-50" : ""
                }`}
              >
                <GripVertical
                  size={20}
                  className="text-muted-foreground flex-shrink-0"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-semibold text-foreground bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {provider.displayName}
                  </span>
                </div>
                {status?.valid === true && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          If the first provider fails, the app will automatically try the next
          one
        </p>
      </div>
    </div>
  );
};

export default PrioritySettings;
