import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";
import { MdOutlineAccountCircle } from "react-icons/md";
import { LuNotebookText } from "react-icons/lu";
import { GoPersonAdd } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaHistory } from "react-icons/fa";
import Pulse from "../images/pulse.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <button
        className="fixed h-[30px] w-[60px] top-2 left-2 z-50 md:hidden bg-lightBlue p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
      </button>
      <div
        className={`
          bg-lightBlue shadow-2xl w-[200px] h-screen
          fixed top-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:z-10
        `}
      >
        <nav className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-[120px] w-full flex flex-col justify-center items-center mt-4 md:mt-0">
            <Link to="/">
              <img className="h-[80px] w-[80px]" src={Pulse} alt="Logo" />
            </Link>
            <h1 className="text-xl font-semibold mt-2">
              Health<span className="text-darkBlue">Axis</span>
            </h1>
          </div>

          {/* Links */}
          <ul className="flex flex-col gap-6 ml-[20px] mt-[30px]">
            <li className="text-black flex items-center gap-3">
              <HiOutlineHome size={20} />
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="text-black flex items-center gap-3">
              <LuNotebookText size={20} />
              <NavLink
                to="/appointment"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Appointment
              </NavLink>
            </li>
            <li className="text-black flex items-center gap-3">
              <MdOutlineAccountCircle size={20} />
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Doctors
              </NavLink>
            </li>
            <li className="text-black flex items-center gap-3">
              <GoPersonAdd size={20} />
              <NavLink
                to="/prescription"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Prescription
              </NavLink>
            </li>
            <li className="text-black flex items-center gap-3">
              <FaHistory size={20} />
              <NavLink
                to="/prescription-history"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Prescription History
              </NavLink>
            </li>
            <li className="text-black flex items-center gap-3">
              <TiMessages size={20} />
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? "text-darkBlue font-semibold" : "text-black"
                }
              >
                Messages
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
