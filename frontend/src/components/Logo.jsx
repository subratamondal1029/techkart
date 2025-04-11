import React from "react";

const Logo = ({ classname, width }) => {
  return (
    <div className={`${classname}`}>
      {/* TODO: fetch the logo from server */}
      <img src="/logo.png" alt="Logo" className={`w-[${width}] rounded-full`} />
    </div>
  );
};

export default Logo;
