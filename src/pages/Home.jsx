import React from "react"
import { FaArrowRight } from "react-icons/fa6";
import DashboardImage from "../images/dashboardImage.png"

const Home = () => {
    return (
        <div className=" bg-main4 w-full h-screen flex justify-center items-center">
            <div className="bg-blac h-[500px] w-[1200px] flex flex-row justify-between">
                <div className="bg-whit w-[550px] h-[500px] flex flex-col justify-center">
                    <div className="flex flex-col gap-[50px]" >
                        <h1 className="text-[40px] leading-[50px] font-semibold">Welcome To The <span>HealthAxis</span> Dashboard</h1>
                        <p className="text-md">The HealthAxis Dashboard is a centralized platform designed for managing and monitoring various aspects of healthcare services. It provides an intutive and user friendly interface for administrator, medical proffessionals and patient to access essential health-related information efficiently </p>
                        <button className="flex flex-row gap-2 items-center justify-center bg-darkBlue w-[150px] h-[40px] rounded-[5px] shadow-darkBlue/70 shadow-lg">
                            GET STARTED
                            <div className="mt-[5px]">
                                <FaArrowRight />
                            </div>
                        </button>
                    </div>
                </div>


                <div className="bg-whit w-[650px] h-[500px]">
                        <img className="h-[500px] w-[650px]" src={DashboardImage} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Home;