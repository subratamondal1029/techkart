import React, { useEffect, useState } from "react";

/**
 *
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} props
 * @returns {React.ReactElement}
 */

const Image = ({ src, alt = "image", className = "", ...props }) => {
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
    const msg = error
      ? "Image Loading error"
      : !loaded
      ? "Image Loading"
      : "Image Loaded";
    console.log(msg);
  }, [error, loaded]);

  return (
    <div className={`overflow-hidden ${className}`}>
      {error ? (
        <div className="w-full h-full bg-gray-200">Image Loading error</div>
      ) : !loaded ? (
        <div className="w-full h-full bg-gray-300 animate-pulse">
          Image Loading
        </div>
      ) : null}
      <img
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 w-full h-full object-cover`}
        {...props}
      />
    </div>
  );
};

export default Image;
