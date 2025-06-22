import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

// No changes needed in imports

function Chat() {
  const { id } = useParams();
  const receiverId = typeof id === "string" ? id : id?.toString();
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const token = user.token;
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchMessages();
    socket.emit("join", user._id);

    socket.on("newMessage", (msg) => {
      if (
        (msg.from === user._id && msg.to === receiverId) ||
        (msg.from === receiverId && msg.to === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [receiverId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `${BASE_URL}/api/messages`,
        { to: receiverId, content: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
      setText("");
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  const deleteChat = async () => {
    const confirm = await Swal.fire({
      title: "Delete Chat?",
      text: "This will permanently delete the conversation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/api/messages/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages([]);
        Swal.fire("Deleted!", "Chat has been deleted.", "success");
      } catch (err) {
        console.error("Delete chat error", err);
        Swal.fire("Error", "Failed to delete chat.", "error");
      }
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-indigo-700">
          Private Chat
        </h2>
        <button
          onClick={deleteChat}
          title="Delete chat"
          className="text-red-500 hover:text-red-700 text-xl"
        >
          <MdDelete />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 px-1 sm:px-2 mb-3">
        {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[80%] sm:max-w-[70%] p-2 rounded-xl text-sm break-words ${
            msg.from === user._id
              ? "bg-indigo-100 self-end text-right"
              : "bg-gray-200 self-start"
          }`}
        >
          <div>{msg.content}</div>
          <div className="text-[10px] text-gray-500 mt-1">
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border p-2 rounded-lg text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
