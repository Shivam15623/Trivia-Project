import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Plus, Trash2, Info, AlertCircle, Edit } from "lucide-react";

type DialogType = "default" | "add" | "edit" | "delete" | "info" | "warning";
type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

type Props = {
  title: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  resetForm?: () => void;

  type?: DialogType;
  size?: DialogSize;
};
const typeStyleMap: Record<
  DialogType,
  {
    titleClass: string;
    dialogClass?: string;
    icon: ReactNode;
    iconBgClass: string;
    headerClass?: string;
    descriptionClass?: string;
    contentClass?: string;
    footerClass?: string;
  }
> = {
  default: {
    titleClass: "text-xl font-semibold text-[#ff8c42]",
    dialogClass: "border border-[#fff0e5] bg-[#fff8f0]",
    icon: <Info className="w-5 h-5" />,
    iconBgClass: "bg-[#fff0e5] text-[#ff8c42]",
    headerClass: "pb-2 border-b border-[#fff0e5]",
    descriptionClass: "text-sm text-[#6b7280] mt-1",
    contentClass: "bg-[#fff8f0]",
    footerClass: "pt-2 border-t border-[#fff0e5]",
  },
  add: {
    titleClass: "text-[#fcbf49] font-bold",
    dialogClass: "border border-[#ffc070]/30 bg-[#fff8f0]",
    icon: <Plus className="w-5 h-5" />,
    iconBgClass: "bg-[#fff0e5] text-[#fcbf49]",
    headerClass: "pb-2 border-b border-[#ffc070]/30",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "bg-[#fff8f0]",
    footerClass: "pt-2 border-t border-[#ffc070]/30",
  },
  edit: {
    titleClass: "text-[#ff8c42] font-bold",
    dialogClass: "border border-[#ffc070]/30 bg-[#fff8f0]",
    icon: <Edit className="w-5 h-5" />,
    iconBgClass: "bg-[#fff0e5] text-[#ff8c42]",
    headerClass: "pb-2 border-b border-[#ffc070]/30",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "bg-[#fff8f0]",
    footerClass: "pt-2 border-t border-[#ffc070]/30",
  },
  delete: {
    titleClass: "text-[#e34b4b] font-bold",
    dialogClass: "border border-[#e34b4b]/20 bg-[#fff8f0]",
    icon: <Trash2 className="w-5 h-5" />,
    iconBgClass: "bg-[#e34b4b]/10 text-[#e34b4b]",
    headerClass: "pb-2 border-b border-[#e34b4b]/20",
    descriptionClass: "text-sm text-[#a90000]/80 mt-1",
    contentClass: "bg-[#e34b4b]/5",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
  info: {
    titleClass: "text-[#f29e4e] font-medium",
    dialogClass: "border border-[#fcbf49]/30 bg-[#fff8f0]",
    icon: <Info className="w-5 h-5" />,
    iconBgClass: "bg-[#fff0e5] text-[#f29e4e]",
    headerClass: "pb-2 border-b border-[#fcbf49]/30",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "bg-[#fff8f0]",
    footerClass: "pt-2 border-t border-[#fcbf49]/30",
  },
  warning: {
    titleClass: "text-[#a90000] font-bold",
    dialogClass: "border border-[#e34b4b]/20 bg-[#fff8f0]",
    icon: <AlertCircle className="w-5 h-5" />,
    iconBgClass: "bg-[#e34b4b]/10 text-[#a90000]",
    headerClass: "pb-2 border-b border-[#e34b4b]/20",
    descriptionClass: "text-sm text-[#a90000]/80 mt-1",
    contentClass: "bg-[#e34b4b]/5",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
};

export const DialogWrapper = ({
  title,
  description,
  children,
  trigger,

  onOpenChange,
  resetForm,

  type = "default",
  size = "md",
}: Props) => {
  const style = typeStyleMap[type];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) resetForm?.();
        onOpenChange?.(open);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        size={size}
        className={cn(
          "shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 gap-2",

          style.dialogClass
        )}
      >
        <DialogHeader className={cn(style.headerClass, "flex")}>
          
            <DialogTitle
              className={cn("flex items-center gap-2", style.titleClass)}
            >
              <div
                className={cn(
                  "p-1.5 rounded-full flex items-center justify-center",
                  style.iconBgClass
                )}
              >
                {style.icon}
              </div>

              <span>{title}</span>
            </DialogTitle>
            {description && (
              <DialogDescription className={style.descriptionClass}>
                {description}
              </DialogDescription>
            )}
          
        </DialogHeader>

        <div className={cn("py-1", style.contentClass)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

DialogWrapper.CancelButton = function CancelButton() {
  return (
    <DialogClose asChild>
      <Button variant="outline">Cancel</Button>
    </DialogClose>
  );
};
