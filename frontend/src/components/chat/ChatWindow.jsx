import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { sendMessage } from "../../services/chatService";
import { db } from "../../firebaseConfig";
import { Container, Card, Form, Button } from "react-bootstrap";

const ChatWindow = ({ chatId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    await sendMessage(chatId, currentUser, newMessage);
    setNewMessage(""); // Clear input field
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header as="h5">Chat</Card.Header>
        <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 ${
                msg.sender === currentUser ? "text-end text-primary" : "text-start text-dark"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Card.Body>
        <Card.Footer>
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // Send on Enter key
            />
            <Button variant="primary" className="ms-2" onClick={handleSendMessage}>
              Send
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ChatWindow;
