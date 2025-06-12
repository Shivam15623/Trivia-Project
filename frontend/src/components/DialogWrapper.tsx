import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // ShadCN utility for merging classNames
import { ReactNode } from "react";
// Import Lucide React icons
import { Plus, Pencil, Trash2, Info, AlertCircle } from "lucide-react";

type DialogType = "default" | "add" | "edit" | "delete" | "info" | "warning";
type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  triggerLabel?: string;
  icon?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  resetForm?: () => void;
  dialogClassName?: string;
  triggerClassName?: string;
  type?: DialogType;
  size?: DialogSize; // New size prop
  showHeaderIcon?: boolean; // Option to show/hide header icon
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
};

// Define type style map with Lucide icons
const typeStyleMap: Record<
  DialogType,
  {
    titleClass: string;
    dialogClass: string;
    icon: ReactNode;
    iconBgClass: string;
    headerClass?: string;
    descriptionClass?: string;
    contentClass?: string;
    footerClass?: string;
  }
> = {
  default: {
    titleClass: "text-xl font-semibold",
    dialogClass: "",
    icon: <Info className="w-5 h-5" />,
    iconBgClass: "bg-gray-100 text-gray-700",
    headerClass: "space-y-1.5",
    descriptionClass: "text-sm text-muted-foreground",
    contentClass: "",
    footerClass:
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  },
  add: {
    titleClass: "text-green-600 font-bold",
    dialogClass: "border-green-100",
    icon: <Plus className="w-5 h-5" />,
    iconBgClass: "bg-green-100 text-green-600",
    headerClass: "pb-2 border-b border-green-100",
    descriptionClass: "text-sm text-green-700/70 mt-1",
    contentClass: " bg-green-50/30",
    footerClass: "pt-2 border-t border-green-100",
  },
  edit: {
    titleClass: "text-blue-600 font-bold",
    dialogClass: "border-blue-100",
    icon: <Pencil className="w-5 h-5" />,
    iconBgClass: "bg-blue-100 text-blue-600",
    headerClass: "pb-2 border-b border-blue-100",
    descriptionClass: "text-sm text-blue-700/70 mt-1",
    contentClass: " bg-blue-50/30",
    footerClass: "pt-2 border-t border-blue-100",
  },
  delete: {
    titleClass: "text-red-600 font-bold",
    dialogClass: "border-red-100",
    icon: <Trash2 className="w-5 h-5" />,
    iconBgClass: "bg-red-100 text-red-600",
    headerClass: "pb-2 border-b border-red-100",
    descriptionClass: "text-sm text-red-700/70 mt-1",
    contentClass: " bg-red-50/30",
    footerClass: "pt-2 border-t border-red-100",
  },
  info: {
    titleClass: "text-blue-600 font-medium",
    dialogClass: "border-blue-200",
    icon: <Info className="w-5 h-5" />,
    iconBgClass: "bg-blue-100 text-blue-600",
    headerClass: "pb-2 border-b border-blue-200",
    descriptionClass: "text-sm text-blue-600/80 mt-1",
    contentClass: " bg-blue-50/30",
    footerClass: "pt-2 border-t border-blue-200",
  },
  warning: {
    titleClass: "text-amber-600 font-bold",
    dialogClass: "border-amber-100",
    icon: <AlertCircle className="w-5 h-5" />,
    iconBgClass: "bg-amber-100 text-amber-600",
    headerClass: "pb-2 border-b border-amber-100",
    descriptionClass: "text-sm text-amber-700/70 mt-1",
    contentClass: " bg-amber-50/30",
    footerClass: "pt-2 border-t border-amber-100",
  },
};

export const DialogWrapper = ({
  title,
  description,
  children,
  triggerLabel,
  icon,
  onOpenChange,
  resetForm,
  dialogClassName,
  triggerClassName,
  type = "default",
  size = "md", // Default to medium size
  showHeaderIcon = true, // Show header icon by default
  variant = "outline",
  buttonSize = "default",
}: Props) => {
  const styles = typeStyleMap[type];

  // Determine which icon to use - custom icon or type-specific icon
  const triggerIcon = icon || (type !== "default" ? styles.icon : null);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && resetForm) resetForm();
        onOpenChange?.(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={cn(
            // Add type-specific button styling
            type === "delete" && variant !== "destructive",
            type === "add" && variant !== "default" ,
            type === "edit" && variant !== "default",
            type === "warning" && variant !== "default" ,
            triggerClassName
          )}
          variant={variant}
          size={buttonSize}
        >
          {triggerIcon}
          {triggerLabel && (
            <span className={triggerIcon ? "ml-2" : ""}>{triggerLabel}</span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent
        size={size}
     
        className={cn(
          styles.dialogClass,
          // Apply size from size map
          "shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 gap-2",
          dialogClassName
        )}
      >
        <DialogHeader className={cn(styles.headerClass)}>
          <DialogTitle
            className={cn(styles.titleClass, "flex items-center gap-2")}
          >
            {showHeaderIcon && (
              <div
                className={cn(
                  "p-1.5 rounded-full flex items-center justify-center",
                  styles.iconBgClass
                )}
              >
                {styles.icon}
              </div>
            )}
            <span>{title}</span>
          </DialogTitle>
          {description && (
            <DialogDescription className={cn(styles.descriptionClass)}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn("py-1", styles.contentClass)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
