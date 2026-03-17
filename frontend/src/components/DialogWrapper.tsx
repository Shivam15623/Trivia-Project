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
import { Plus, Trash2, Info, AlertCircle, Edit, X } from "lucide-react";

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
    titleClass: "text-white",
    dialogClass:
      "bg-[linear-gradient(180deg,_#FF6D00_0%,_#FA9923_100%)] p-[30px] border-0",
    icon: <Info className="h-6 w-6" />,
    iconBgClass: " text-white",
    headerClass: "pb-5 border-b border-[#FFFFFF33]",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
  add: {
    titleClass: "text-white",
    dialogClass:
      "bg-[linear-gradient(180deg,_#FF6D00_0%,_#FA9923_100%)] p-[30px] border-0",
    icon: <Plus className="h-6 w-6" />,
    iconBgClass: " text-white",
    headerClass: "pb-5 border-b border-[#FFFFFF33]",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
  edit: {
    titleClass: "text-white",
    dialogClass:
      "bg-[linear-gradient(180deg,_#FF6D00_0%,_#FA9923_100%)] p-[30px] border-0",
    icon: <Edit className="h-6 w-6" />,
    iconBgClass: " text-white",
    headerClass: "pb-5 border-b border-[#FFFFFF33]",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },

  delete: {
    titleClass: "text-white",
    dialogClass:
      " bg-[linear-gradient(179.03deg,_#2884C7_0.83%,_#7BFDFD_181.09%)] p-[30px] border-0",
    icon: <Trash2 className="h-6 w-6" />,
    iconBgClass: " text-white",
    headerClass: "pb-5 border-b border-[#FFFFFF33]",
    descriptionClass: "text-sm text-[#a90000]/80 mt-1",
    contentClass: " ",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
  info: {
    titleClass: "text-white",
    dialogClass:
      "bg-[linear-gradient(180deg,_#FF6D00_0%,_#FA9923_100%)] p-[30px] border-0",
    icon: <Info className="h-6 w-6" />,
    iconBgClass: " text-white",
    headerClass: "pb-5 border-b border-[#FFFFFF33]",
    descriptionClass: "text-sm text-[#ff8c42]/80 mt-1",
    contentClass: "",
    footerClass: "pt-2 border-t border-[#e34b4b]/20",
  },
  warning: {
    titleClass: "text-[#a90000] font-bold",
    dialogClass: " bg-[#fff8f0] border-0",
    icon: <AlertCircle className="h-5 w-5" />,
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
          "gap-5 rounded-[30px] shadow-lg",
          "[&>button]:hidden",
          style.dialogClass,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "url('/Noise.png')",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-20 flex flex-col gap-5">
          <DialogHeader className={cn(style.headerClass, "flex")}>
            <DialogTitle
              className={cn(
                "flex items-center justify-between gap-2 font-outfit text-[24px] font-normal",
                style.titleClass,
              )}
            >
              <div className="flex items-center gap-2">
                {" "}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5",
                    style.iconBgClass,
                  )}
                >
                  {style.icon}
                </div>
                <span>{title}</span>
              </div>
              <DialogClose asChild>
                <button className="rounded-md p-1 transition hover:bg-white/10">
                  <X className="h-6 w-6" />
                </button>
              </DialogClose>
            </DialogTitle>
            {description && (
              <DialogDescription className={style.descriptionClass}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {children}
        </div>
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
