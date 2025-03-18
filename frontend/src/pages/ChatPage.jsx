import { useState, useEffect } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { Container, Row, Col, Card } from "react-bootstrap";
import jwtDecode from "jwt-decode";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT from localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.username); // Extract username from token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Your Chats</Card.Header>
            <Card.Body>
              {currentUser ? (
                <ChatList currentUser={currentUser} onSelectChat={setSelectedChat} />
              ) : (
                <p>Loading user...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {selectedChat && currentUser ? (
            <ChatWindow chatId={selectedChat} currentUser={currentUser} />
          ) : (
            <p>Select a chat to start messaging</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
