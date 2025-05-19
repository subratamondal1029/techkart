import { Camera } from "lucide-react";
import Image from "./Image";
import { useId, useState } from "react";
import fileService from "../services/file.service";
import { useFormContext } from "react-hook-form";
import showToast from "../utils/showToast";
import { useEffect } from "react";

const ImageUpload = ({
  src,
  alt = "image",
  placeholder,
  onUpdate,
  accept = ".jpeg, .png, .jpg, .webp",
  classname = "",
  rules = { required: "Image is required" },
  name = "file",
  ...props
}) => {
  const Id = useId();
  const [isDragging, setIsDragging] = useState(false);
  const formContext = useFormContext();
  const [image, setImage] = useState(src);

  const upload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.target.files?.[0] || e.dataTransfer.files?.[0];

    try {
      fileService.validate(file);
      const imageUrl = URL.createObjectURL(file);

      if (image) URL.revokeObjectURL(image);
      setImage(imageUrl);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }

    if (formContext) {
      formContext.setValue(name, file, { shouldValidate: true });
      formContext.clearErrors(name);
      return;
    }

    try {
      await onUpdate(file);
    } catch (error) {
      setImage(src);
    }
  };

  const borderClass = formContext?.formState.errors?.[name]
    ? "border-red-500"
    : "border-blue-200";

  useEffect(() => {
    if (formContext) {
      formContext.register(name, rules);
    }
  }, [formContext, name]);

  return (
    <div
      onDrop={upload}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      className={`w-full h-full flex items-center justify-center relative rounded-full overflow-hidden cursor-pointer border-4 ${borderClass} shadow-md mx-auto transition-all duration-300 hover:border-blue-400 ${classname}`}
      {...props}
    >
      {image ? (
        <Image
          key={image}
          src={image?.includes("blob:") ? image : fileService.get(image)}
          className="w-full h-full object-cover"
          alt={alt}
        />
      ) : (
        placeholder
      )}
      <label
        htmlFor={Id}
        className={`absolute bottom-0 right-0 w-full h-full flex justify-center items-center bg-blue-500/60 cursor-pointer transition-opacity duration-300 opacity-0 hover:opacity-100 ${
          isDragging ? "opacity-100" : "opacity-0"
        }`}
      >
        <Camera size={28} className="text-white drop-shadow" />
      </label>
      <input
        type="file"
        id={Id}
        name={name}
        accept={accept}
        className="hidden"
        onChange={upload}
      />
      {formContext?.formState.errors?.[name] && (
        <span className="text-red-500 text-xs absolute bottom-2 left-2">
          {formContext.formState.errors[name].message}
        </span>
      )}
    </div>
  );
};

export default ImageUpload;
