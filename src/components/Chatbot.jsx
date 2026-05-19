// Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";

function Chatbot() {
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello ${
        localStorage.getItem("full_name") || "User"
      } 👋

I’m LDCE Grievance AI Assistant.

How can I help you today?`
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const quickAsk = (text) => {
    sendMessage(text);
  };

  const sendMessage = async (forcedText = null) => {
    const userText = forcedText || message;

    if (!userText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access");
      
      console.log("CHATBOT TOKEN:", token);

      const response = await fetch(
        "https://college-grievance-backend-85gg.onrender.com/api/chatbot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
               Authorization: `Bearer ${token}`
            })
          },
          body: JSON.stringify({
            message: userText
          })
        }
      );

      const data = await response.json();
      
      console.log("CHATBOT RESPONSE:", data);
      console.log("STATUS:", response.status);
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||  data.detail || 
            "Sorry, I could not answer that."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Server connection failed."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {!showChat && (
        <button
          className="chatbot-button"
          onClick={() =>  setShowChat(true)}
        >
          💬
        </button>
      )}

      {showChat && (
        <div className="chatbot-box">

          {/* HEADER */}
          <div className="chatbot-header">
            <div>
              LDCE AI Assistant
            </div>

            <div className="chat-header-buttons">
              <button
                onClick={() =>
                  setMinimized(!minimized)
                }
              >
                —
              </button>

              <button
                onClick={() =>
                  setShowChat(false)
                }
              >
                ✕
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* CHAT AREA */}
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-msg ${msg.sender}`}
                  >
                    {msg.text}
                  </div>
                ))}

                {loading && (
                  <div className="chat-msg bot">
                    Thinking...
                  </div>
                )}

                <div ref={chatEndRef}></div>
              </div>

              {/* QUICK BUTTONS */}
              <div className="quick-buttons">
                <button
                  onClick={() =>
                    quickAsk(
                      "How to file grievance?"
                    )
                  }
                >
                  File Complaint
                </button>

                <button
                  onClick={() =>
                    quickAsk(
                      "What is my complaint status?"
                    )
                  }
                >
                  Check Status
                </button>

                <button
                  onClick={() =>
                    quickAsk(
                      "How to download report?"
                    )
                  }
                >
                  Download Report
                </button>

                <button
                  onClick={() =>
                    quickAsk(
                      "What is grievance?"
                    )
                  }
                >
                  What is Grievance?
                </button>
              </div>

              {/* INPUT */}
              <div className="chatbot-input">
                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Ask something..."
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    sendMessage()
                  }
                />

                <button
                  onClick={() =>
                    sendMessage()
                  }
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;