import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [messageDb, setMessageDb] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8081/");

    newSocket.on("public_channel", (data) => {
      setMessageDb((messageDb) => [...messageDb, data.text]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("public_channel", { text: message });
    }
    setMessage("");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold mb-4">Chat Room</h1>
      <div className="bg-white w-96 p-4 rounded-lg shadow-md">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {messageDb.map((item, index) => (
            <div key={index} className="bg-blue-100 rounded-md p-2 text-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
