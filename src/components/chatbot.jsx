import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  function handleToggleChat() {
    setIsVisible(true);
  }

  function handleCloseChat() {
    setIsVisible(false);
  }

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  function appendMessage(sender, text) {
    setMessages((prev) => [...prev, { sender: sender, text: text }]);
  }

  async function getBotResponse(userMessage) {
    var API_KEY = "AIzaSyCT00WnSs-PpGwM0yuc43nefTWVFgY-Nw4";
    var API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      var response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      });

      var data = await response.json();

      if (!data.candidates || !data.candidates.length) {
        throw new Error("No response from Gemini API");
      }

      var botMessage = data.candidates[0].content.parts[0].text;
      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error:", error);
      appendMessage("bot", "Sorry, I'm having trouble responding. Please try again.");
    }
  }

  function handleSend() {
    var trimmed = input.trim();
    if (trimmed !== "") {
      appendMessage("user", trimmed);
      setInput("");
      getBotResponse(trimmed);
    }
  }

  useEffect(function () {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div
        id="chatbot-icon"
        style={{ display: isVisible ? "none" : "flex" }}
        onClick={handleToggleChat}
      >
        💬
      </div>

      <div
        id="chatbot-container"
        className={isVisible ? "" : "hidden"}
      >
        <div id="chatbot-header">
          <span>Codemeet ChatBot</span>
          <button id="close-btn" onClick={handleCloseChat}>
            &times;
          </button>
        </div>
        <div id="chatbot-body">
          <div id="chatbot-messages">
            {messages.map(function (msg, index) {
              return (
                <div key={index} className={"message " + msg.sender}>
                  {msg.text}
                </div>
              );
            })}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div id="chatbot-input-container">
          <input
            type="text"
            id="chatbot-input"
            value={input}
            placeholder="Type a message"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button id="send-btn" onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
