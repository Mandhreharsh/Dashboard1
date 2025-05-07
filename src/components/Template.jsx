import React from "react";
import { Context } from "../index";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Signupform from "./Signupform";
import Loginform from "./Loginform";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Template.css";
import left from "../images/left.png";
import right from "../images/right.png";
import Loginbg from "../images/loginbg.png";

const Template = ({ formtype, setIsLoggedIn }) => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center ">
      <img className="absolute left-[-0px] top-[385px] -z-10" src={left} alt="" />
      <img className="absolute right-[-0px] top-[0px] -z-10" src={right} alt="" />
      <div className="bg-dashboardviolet h-[580px] w-[1200px] rounded-[5px] z-1 flex flex-row gap-[40px]">
        <div className="bg-blac w-[580px] flex flex-col items-center justify-center">
          <div className="w-[600px] h-[600px]">
            <img src={Loginbg} alt="" />
          </div>
        </div>

        <div className="bg-blac w-[580px] flex flex-col items-center justify-center">
          <div className="w-[550px]">
            {
              formtype === "signup" ?
                (<Signupform setIsLoggedIn={setIsLoggedIn} />)
                : (<Loginform setIsLoggedIn={setIsLoggedIn} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
