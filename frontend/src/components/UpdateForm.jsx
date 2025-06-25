import React from "react";
import { Button, Input, Logo } from "./";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { X } from "lucide-react";

/**
 * Reusable form component with animation, close button, and react-hook-form support.
 *
 * @param {React.FormHTMLAttributes<HTMLFormElement> & {
 *   setIsOpen: () => void,
 *   onSubmit: (data: object) => void,
 *   classname?: string,
 *   animation?: string,
 *   children: React.ReactNode,
 * }} props - Props including form attributes and custom handlers.
 * @returns {React.ReactElement} The rendered form element.
 */

const UpdateForm = ({
  setIsOpen,
  onSubmit,
  classname = "",
  children,
  ...props
}) => {
  const methods = useForm();
  const [animation, setAnimation] = useState("animate-card-in");

  const closeFormWithoutSubmit = useCallback((e) => {
    if (e.type === "keyup" && e.key !== "Escape") return;

    console.log("closing form");
    methods.reset();
    setAnimation("animate-card-out");
  }, []);

  useEffect(() => {
    document.body.classList.add("portal-open");
    document.addEventListener("keyup", closeFormWithoutSubmit);
    return () => {
      document.body.classList.remove("portal-open");
      document.removeEventListener("keyup", closeFormWithoutSubmit);
    };
  }, []);

  const handleAnimationEnd = () => {
    if (animation === "animate-card-out") {
      setAnimation("animate-card-in");
      setIsOpen(false);
    }
  };

  const submitForm = (data) => {
    setAnimation("animate-card-out");
    onSubmit(data, methods);
  };

  return createPortal(
    <div
      className="w-screen h-screen fixed inset-0 bg-gray-800/50 z-20 flex justify-center items-start overflow-y-auto py-5"
      onClick={closeFormWithoutSubmit}
    >
      <FormProvider {...methods}>
        <form
          className={`w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 relative ${animation} ${classname}`}
          {...props} // Ensure props like autoComplete are passed here
          onSubmit={methods.handleSubmit(submitForm)}
          onAnimationEnd={handleAnimationEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            id="close-button"
            onClick={closeFormWithoutSubmit}
            className="absolute top-4 right-4 cursor-pointer"
          >
            {<X />}
          </button>
          {children}
          <Button type="submit" classname="w-full">
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>,
    document.getElementById("portal-root")
  );
};
export default UpdateForm;
