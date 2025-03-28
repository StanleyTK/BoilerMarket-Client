import React from "react";

interface NewChatProps {
    listingId: number;
}

export const NewChat: React.FC<NewChatProps> = ({ listingId }) => {
    const handleSendMessage = (message: string) => {
        console.log(`Message sent: ${message}`);
        // Placeholder for actual send message logic
    };

    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");

    return (
        <>
            <button 
            onClick={() => setIsPopupOpen(true)} 
            style={{
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "10px",
            }}
            >
            Open Chat
            </button>
            {isPopupOpen && (
            <div 
                className="popup" 
                style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000
                }}
            >
                <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px"
                }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button 
                    onClick={() => {
                    handleSendMessage(message);
                    setMessage("");
                    setIsPopupOpen(false);
                    }}
                    style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginRight: "10px"
                    }}
                >
                    Send
                </button>
                <button 
                    onClick={() => setIsPopupOpen(false)}
                    style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                    }}
                >
                    Close
                </button>
                </div>
            </div>
            )}
        </>
    );
}