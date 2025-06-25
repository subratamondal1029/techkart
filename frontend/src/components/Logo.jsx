import React from "react";
import fileService from "../services/file.service";
import { Image } from "./index";
import { LOGO_ID } from "../../constants";

const Logo = ({ classname, width }) => {
  return (
    <div className={`${classname}`}>
      <Image
        src={fileService.get(LOGO_ID)}
        alt="Logo"
        className={`w-[${width}] rounded-full`}
      />
    </div>
  );
};

export default Logo;
