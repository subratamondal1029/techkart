import React from "react";
import fileService from "../services/file.service";

const Logo = ({ classname, width }) => {
  return (
    <div className={`${classname}`}>
      <img
        src={fileService.get("67eeb1fcfaf070cbfb48da8c")}
        alt="Logo"
        className={`w-[${width}] rounded-full`}
      />
    </div>
  );
};

export default Logo;
