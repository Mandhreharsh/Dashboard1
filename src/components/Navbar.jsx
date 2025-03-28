import React from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";
import { MdOutlineAccountCircle } from "react-icons/md";
import { LuNotebookText } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { GoPersonAdd } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { IoIosLogOut } from "react-icons/io";
import Pulse from "../images/pulse.png"

const Navbar = () => {
    return (
        <div className="bg-lightBlue shadow-4xl w-[200px] h-screen">
            <nav className="flex flex-col">
                <div className="h-[120px] w-[160px] ml-[10px] bg-whit flex flex-col justify-center items-center">
                    <Link>
                    <img className="h-[80px] w-[80px]" src={Pulse} alt=""/>
                    </Link>
                    
                    <div>
                        <h1 className="text-xl font-semibold">Health<span className="text-darkBlue">Axis</span></h1>
                    </div>
                </div>

                <ul className="flex flex-col gap-8 ml-[30px] mt-[30px]">
                    <li className="text-black flex flex-row gap-4">
                       <i className="mt-[5px]">
                       <HiOutlineHome />
                       </i>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                           <i className="mt-[5px]">
                           <LuNotebookText />
                           </i>
                        <NavLink to="/appointment">Appointment</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                        <i className="mt-[5px]">
                        <MdOutlineAccountCircle />
                        </i>
                        <NavLink to="/doctors">Docotrs</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                       <i className="mt-[5px]">
                       <IoPersonAddSharp />
                       </i>
                        <NavLink to="/addadmin">Add Admin</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                       <i className="mt-[5px]">
                       <GoPersonAdd />
                       </i>
                        <NavLink to="/adddoctors">Add Doctors</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                        <i className="mt-[5px]">
                        <TiMessages />
                        </i>
                        <NavLink to="/messages">Messages</NavLink>
                    </li>
                    <li className="text-black flex flex-row gap-4">
                       <i className="mt-[5px]">
                       <IoIosLogOut />
                       </i>
                        <NavLink to="/logout">Logout</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;