import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
type FileFieldProps<TForm extends FieldValues> = {
  name: Path<TForm>;
  label: string;
  control: Control<TForm>;
  className?: string; // 👈 allow parent styling
};

export function FileField<TForm extends FieldValues>({
  name,
  label,
  control,
  className,
}: FileFieldProps<TForm>) {
  const { field } = useController({ name, control });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const file = field.value;

    if (typeof file === "string") {
      setPreview(file);
    } else if (
      typeof File !== "undefined" &&
      file &&
      typeof file === "object" &&
      (file as File).type
    ) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [field.value]);

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel className="font-outfit text-lg font-normal leading-[100%] text-white">
            {label}
          </FormLabel>

          <FormControl>
            <div className={className}>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={(el) => {
                  field.ref(el);
                  inputRef.current = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file || null);
                }}
              />

              <div
                className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden text-center text-sm text-muted-foreground"
                onClick={() => inputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full  object-contain"
                  />
                ) : (
                  <div className="flex flex-row w-full gap-2 text-[#FFFFFF]">
                    <Icon icon={"mynaui:upload"} className="text-2xl" />{" "}
                    <span className="font-outfit text-base font-normal opacity-60">
                      Upload Image
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
