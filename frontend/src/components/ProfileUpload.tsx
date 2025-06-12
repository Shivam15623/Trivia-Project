import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileUploadProps {
  value: FileList | string;
  onChange: (value: FileList) => void;
}

export const ProfileUpload = ({ value, onChange }: ProfileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof FileList && value.length > 0) {
      const file = value[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (typeof value === "string" && value !== "") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <div className="relative w-32 h-32">
      <Avatar className="w-full h-full">
        {preview && <AvatarImage src={preview} alt="Profile" />}
        <AvatarFallback className="text-2xl font-bold">TRIVIA</AvatarFallback>
      </Avatar>

      <label
        htmlFor="profilePicInput"
        className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100"
      >
        <Camera className="w-5 h-5 text-gray-600" />
      </label>

      <Input
        id="profilePicInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onChange(e.target.files);
          }
        }}
      />
    </div>
  );
};
