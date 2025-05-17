import React, { useEffect, useState, useRef } from "react";
import fileService from "../services/file.service";

/**
 *
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} props
 * @returns {React.ReactElement}
 */

const Image = ({ src, alt = "", className = "", size, ...props }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };
  const handleError = () => {
    setError(true);
    setLoaded(false);
  };

  useEffect(() => {
    src = src?.includes("http") ? src : fileService.get(src);
  }, [src]);

  useEffect(() => {
    const imageElm = imgRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imageElm.src = src;
          observer.unobserve(imageElm);
        }
      });
    });

    if (imageElm) {
      observer.observe(imageElm);
    }

    return () => imageElm && observer.unobserve(imageElm);
  }, []);

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={
        size
          ? {
              width: `${size}px`,
              height: `${size}px`,
            }
          : {}
      }
    >
      {error ? (
        <div className="w-full h-full bg-gray-200 text-[1vh] flex items-center justify-center text-center">
          {alt || "Image Load Error"}
        </div>
      ) : !loaded ? (
        <div className="w-full h-full bg-gray-300 animate-pulse"></div>
      ) : null}
      <img
        ref={imgRef}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 w-full h-full object-cover`}
        {...props}
      />
    </div>
  );
};

export default Image;
