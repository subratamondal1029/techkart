import { Phone } from "lucide-react";
import { MapPin } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Instagram } from "lucide-react";
import { Facebook } from "lucide-react";
import { Twitter } from "lucide-react";
import { Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, TextArea } from "../components";
import { FormProvider, useForm } from "react-hook-form";
import useLoading from "../hooks/useLoading";
import contactService from "../services/contact.service";
import showToast from "../utils/showToast";
import { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { useRef } from "react";

const Contact = () => {
  const methods = useForm();
  const [captchaValue, setCaptchaValue] = useState("");
  const captchaRef = useRef(null);

  const [submitHandler, isLoading, error] = useLoading(async (data) => {
    if (!captchaValue) {
      showToast("error", "Please solve the captcha");
      return;
    }
    data.captcha = captchaValue;
    await contactService.send(data);
    showToast("success", "Message sent successfully");
    methods.reset();
    setCaptchaValue("");
    captchaRef.current.reset();
  });

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  useEffect(() => {
    if (error) {
      showToast("error", error);
    }
  }, [error]);

  return (
    <section className="bg-white">
      <div className="container px-6 py-12 mx-auto">
        <div className="lg:flex lg:items-center lg:-mx-6">
          <div className="lg:w-1/2 lg:mx-6">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize  lg:text-3xl">
              Contact us for <br /> more info
            </h1>

            <div className="mt-6 space-y-8 md:mt-8">
              <p className="flex items-start -mx-2">
                <MapPin className="w-6 h-6 mx-2 text-blue-500 " />

                <span className="mx-2 text-gray-700 truncate w-72 ">
                  Techkart, 13A, Raja Rajendralal Mitra Road, Kolkata, West
                  Bengal 700004
                </span>
              </p>

              <p className="flex items-start -mx-2">
                <Phone className="w-6 h-6 mx-2 text-blue-500 " />

                <span className="mx-2 text-gray-700 truncate w-72 ">
                  +91 98765 43210
                </span>
              </p>

              <p className="flex items-start -mx-2">
                <Mail className="w-6 h-6 mx-2 text-blue-500 " />
                <span className="mx-2 text-gray-700 truncate w-72 ">
                  contact@techkart.com
                </span>
              </p>
            </div>

            <div className="mt-6 w-80 md:mt-8">
              <h3 className="text-gray-600 ">Follow us</h3>

              <div className="flex mt-4 -mx-1.5 ">
                <Link
                  className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                  to="#"
                >
                  <Twitter className=" fill-current" size={25} />
                </Link>

                <Link
                  className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                  to="#"
                >
                  <Linkedin className=" fill-current" size={25} />
                </Link>

                <Link
                  className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                  to="#"
                >
                  <Facebook size={25} />
                </Link>

                <Link
                  className="mx-1.5  text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
                  to="#"
                >
                  <Instagram size={25} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:w-1/2 lg:mx-6">
            <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white rounded-lg shadow-2xl  lg:max-w-xl shadow-gray-300/50">
              <h1 className="text-lg font-medium text-gray-700">
                What do you want to ask
              </h1>

              <FormProvider {...methods}>
                <form
                  className="mt-6"
                  onSubmit={methods.handleSubmit(submitHandler)}
                >
                  <fieldset disabled={isLoading}>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      label="Name"
                      rules={{ required: true, minLength: 3 }}
                      name="name"
                      classname="focus:border-blue-400 placeholder:text-gray-400"
                    />

                    <Input
                      type="email"
                      placeholder="johndoe@example.com"
                      label="Email"
                      name="email"
                      rules={{
                        required: true,
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      }}
                      classname="focus:border-blue-400 placeholder:text-gray-400"
                    />

                    <TextArea
                      label="Message"
                      name="message"
                      placeholder="Enter your message"
                      rules={{ required: true, minLength: 10 }}
                      classname="focus:border-blue-400 placeholder:text-gray-400 h-40"
                    />

                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                      className="w-full mt-5"
                      ref={captchaRef}
                      onChange={onCaptchaChange}
                    />

                    <Button
                      type="submit"
                      classname="w-full mt-5 h-14"
                      loader={isLoading}
                    >
                      Get in touch
                    </Button>
                  </fieldset>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
