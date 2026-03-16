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
import { Option, RadioGroup } from "../ui/radiogroup";
import PhoneInput from "react-phone-input-2";
import { cn } from "@/lib/utils";

type InputType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "radio"
  | "profile-upload"
  | "phone";

type RenderFieldProps<
  TForm extends FieldValues,
  TOption = string | { [key: string]: unknown },
> = {
  name: Path<TForm>;
  label?: string;
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
  getOptionLabel = (opt: TOption) => String(opt),
  getOptionValue = (opt: TOption) => String(opt),
  className = "",
}: RenderFieldProps<TForm, TOption>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {type !== "radio" && type !== "profile-upload" && label && (
            <FormLabel className={labelClass}>
              {label}
              {inputProps.required && <span className="text-red-500"> *</span>}
            </FormLabel>
          )}

          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                className={className}
                value={field.value ?? ""}
                onChange={field.onChange}
                ref={field.ref}
              />
            ) : type === "select" ? (
              <Select
                onValueChange={field.onChange}
                value={(field.value ?? "").toString()}
              >
                <SelectTrigger className={className}>
                  <SelectValue
                    className="text-white"
                    placeholder="Select an option"
                  />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => {
                    const value = getOptionValue(option);
                    const label = getOptionLabel(option);
                    return (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : type === "date" ? (
              <DatePickerDemo className={className} {...field} />
            ) : type === "profile-upload" ? (
              <ProfileUpload value={field.value} onChange={field.onChange} />
            ) : type === "radio" ? (
              <RadioGroup
                options={options as Option[]}
                value={field.value}
                onChange={field.onChange}
                className={className}
              />
            ) : type === "phone" ? (
              <div className="relative">
                <PhoneInput
                  country="in"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  inputStyle={{ width: "100%" }}
                  containerClass="!relative"
                  inputClass={cn(
                    "h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] focus:outline-none",
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300",
                    className,
                  )}
                  buttonStyle={{
                    borderTopLeftRadius: "0.375rem",
                    borderBottomLeftRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                  }}
                  dropdownStyle={{
                    position: "fixed", // ← was "absolute", change to "fixed"
                    zIndex: 9999,
                    top: "auto",
                    left: "auto",
                  }}
                />
              </div>
            ) : (
              <Input
                {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
                type={type}
                className={className}
                value={field.value ?? ""}
                onChange={
                  type === "number"
                    ? (e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
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
