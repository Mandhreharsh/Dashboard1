const { indigo } = require('@mui/material/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend:{
      backgroundImage: {main: "url('images/bgimage.png')", 
                        main2: "url('images/dashboardImage.png')", 
                        main3: "url('images/logoutbg.png')", 
                        main4: "url('images/bgmain2.png')", 
                        main5: "url('images/mainbg5.jpg')", 
                        workbg: "url('images/workbg.png')", 
                        Loginbg: "url('images/login.png')", 
                        Doctorsbg: "url('images/doctorsbg.png')",
                        bgfooter: "url('images/footerbg.jpg')",
                        bgdumbell: "url('images/dumbell.png')",
                        bgdumbell1: "url('images/dumbell1.jpg')",
                        // dashboardbg: "url('images/bgdashboard.png')"
                        dashboardbg: "url('images/dashboardbg2.png')"
                      },
      fontFamily: {
      mullish: ["Mulish", "sans-serif"],
    },
    colors: {
      deepBlue: "#02042a",
      lightBlue: "#F4F6FF",
      darkBlue: "#8F9DFF",
      lightBlue200: "#E0E5EC",
      violet: "#AFBBFF",
      bgBlue: "#D7E3FF",
      buttonBlue: "#ABB6FF",
      violet200: "#C4C1FF",
      lightBlue100: "#A8F1FF",
      lightBlue50: "#D9F6FF",
      violet50: "#CD9BFF",
      violet500: "#D0D2FF",
      lightBlue500: "#9BB3FB",
      Blue100: "#70E1FF",
      indigo: "#B5B7FF",
      violet10: "#CED4FF",
      blue10: "#344CFF",
      black10: "#ADADAD",
      dashboardviolet: "#F9F1FF",

    },
  },
  },
  plugins: [],
}

