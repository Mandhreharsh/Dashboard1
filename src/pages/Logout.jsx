import React from "react"
import LogoutIcon from "../images/logoutIcon.png"

const Logout = () => {
    return (
        <div className=" bg-main4 w-full h-screen flex justify-center items-center">
            <div className="bg-main3 rounded-xl shadow-xl w-[470px] h-[370px] flex flex-col justify-center items-center gap-[50px]">
                <div className="gap-4  flex flex-col justify-center items-center">
                    <div className="bg-lightBlue200 w-[100px] h-[100px] rounded-full flex items-center justify-center">
                        <img className="h-[40px] w-[40px]" src={LogoutIcon} alt="" />
                    </div>

                    <h1 className="font-bold text-4xl">Logout</h1>

                    <h2 className="text-xl">Are you sure you want to logout?</h2>
                </div>

                <div className="flex flex-row gap-6">
                    <button className="bg-bla h-[50px] w-[150px] rounded-[10px] font-bold text-[17px] text-violet50">Cancel</button>
                    <button  className="bg-violet50 text-white h-[50px] w-[150px] rounded-[10px] font-bold text-[17px]">Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Logout;