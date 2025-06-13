import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";
import React from "react";
import { DatePickerDemo } from "@/components/ui/datePicker";
import { ProfileUpload } from "@/components/ProfileUpload";

type InputType =
  | "text"
  | "password"
  | "file"
  | "textarea"
  | "select"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "radio"
  | "profile-upload";

type RenderFieldProps<
  TForm extends FieldValues,
  TOption = string | { [key: string]: unknown }
> = {
  name: Path<TForm>;
  label: string;
  control: Control<TForm>;
  labelClass?: string;
  type?: InputType;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>;
  options?: TOption[];
  className?: string;
  getOptionLabel?: (option: TOption) => string;
  getOptionValue?: (option: TOption) => string | number;
};

export function RenderField<TForm extends FieldValues, TOption = unknown>({
  name,
  label,
  control,
  type = "text",
  inputProps = {},
  labelClass = "",
  options = [],
  getOptionLabel,
  getOptionValue,
  className = "",
}: RenderFieldProps<TForm, TOption>) {
  const isFile = type === "file";
  const isSelect = type === "select";
  const isTextarea = type === "textarea";
  const isDate = type === "date";
  const isProfileUpload = type === "profile-upload";

  const resolveValue = getOptionValue ?? ((opt: TOption) => String(opt));
  const resolveLabel = getOptionLabel ?? ((opt: TOption) => String(opt));

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClass}>
            {label}
            {inputProps.required && <span className="text-red-500"> *</span>}
          </FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea
                className={className}
                {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                value={field.value ?? ""}
                onChange={field.onChange}
                ref={field.ref}
              />
            ) : isSelect ? (
              <Select
                onValueChange={field.onChange}
                value={(field.value ?? "").toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className={className}>
                  {options.map((option) => {
                    const value = resolveValue(option);
                    const label = resolveLabel(option);

                    return (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : isDate ? (
              <DatePickerDemo {...field} />
            ) : isProfileUpload ? (
              <ProfileUpload value={field.value} onChange={field.onChange} />
            ) : (
              <Input
                {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                type={type}
                className={className}
                value={isFile ? undefined : field.value ?? ""}
                onChange={
                  isFile
                    ? (e) => field.onChange(e.target.files?.[0])
                    : field.onChange
                }
                ref={field.ref}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
