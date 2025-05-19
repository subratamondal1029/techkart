import { X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import getRules from "../../utils/getRules";
import { useId } from "react";
import { useEffect } from "react";

const TagInput = ({
  name = "tags",
  defaultValue = [],
  label = "",
  classname = "",
  rules = { required: false },
  placeholder = "Enter tags",
  ...props
}) => {
  const { setValue, trigger } = useFormContext();
  const [error, setError] = useState("");
  const Id = useId();
  const [tags, setTags] = useState(defaultValue || []);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }

    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      if (!tags.includes(inputValue.trim())) {
        const value = inputValue.trim();

        if (value.length < 2) {
          setError("Each Tag Must be at least 2 characters long");
          return;
        }

        const newTags = [...tags, value];
        setError("");
        setTags(newTags);
        setValue(name, newTags);
      }
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue(name, newTags, { shouldValidate: true });
    trigger(name);
  };

  const handleChange = (e) => {
    if (e.target.value.length >= 2 || e.target.value === "") setError("");
    if (e.target.value.trim() === ",") return;
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-3 ml-2 capitalize w-full text-left"
          htmlFor={Id}
        >
          <span>
            {label}: {rules.required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}
      <div
        className={`flex flex-wrap gap-2 border min-h-10 p-2 rounded-md relative  ${
          error ? "border-red-500" : ""
        }`}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded"
          >
            <span>{tag}</span>
            <X
              size={16}
              onClick={() => removeTag(index)}
              className="cursor-pointer hover:text-gray-900"
            />
          </div>
        ))}
        <input
          type="text"
          id={Id}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 outline-none w-full rounded-md bg-transparent text-md placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 ${classname}`}
          placeholder={`${placeholder} | Press Enter or ,`}
          {...props}
        />
        {error && (
          <div className="absolute top-full mt-2 flex flex-col items-center z-10">
            <div className="w-3 h-3 rotate-45 bg-red-500 mb-[-6px]" />

            <div className="bg-red-500 text-white text-sm px-3 py-1 rounded shadow">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
