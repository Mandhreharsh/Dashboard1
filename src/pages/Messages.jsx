import React, { useEffect, useState } from "react";
import messageIcon from "../images/messageIcon.png";
import axios from "axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("https://dashboard1-yhmt.onrender.com/api/v1/message/getall", { withCredentials: true });
        setMessages(data.messages);
      } catch (error) {
        console.log("ERROR OCCURRED WHILE FETCHING MESSAGES:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="bg-main4 w-full min-h-screen flex flex-col px-4 md:px-10 py-5">
      <div className="flex items-center gap-3 mb-4">
        <img className="h-6 w-6 sm:h-8 sm:w-8" src={messageIcon} alt="message icon" />
        <h1 className="text-lg sm:text-xl font-semibold">Messages</h1>
      </div>

      <div className="shadow-xl rounded-lg w-full max-w-[1300px] h-[640px] overflow-x-auto p-4  scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-lightBlue h-[150px] rounded-lg p-4 flex flex-col gap-3">
                <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
                <div className="bg-gray-300 h-6 w-full max-w-[500px] rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {messages && messages.length > 0 ? (
              messages.map((element, idx) => (
                <div key={idx} className="bg-lightBlue mt-6 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex-1">
                  <p className="font-semibold">First Name: <span className="font-normal">{element.firstName}</span></p>
                  <p className="font-semibold">Last Name: <span className="font-normal">{element.lastName}</span></p>
                  <p className="font-semibold">Email: <span className="font-normal">{element.email}</span></p>
                  <p className="font-semibold">Phone: <span className="font-normal">{element.Phone}</span></p>
                  <p className="font-semibold">Message:</p>
                  <p className="font-normal break-words">{element.message}</p>
                </div>
              </div>
              
              ))
            ) : (
              <h1 className="text-center text-gray-500 font-semibold">No Messages</h1>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
