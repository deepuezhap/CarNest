import { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { Container, Row, Col, Card } from "react-bootstrap";
import useAuth from "../hooks/useAuth"; // Import your custom hook

const ChatPage = () => {
  const currentUser = useAuth(); // ✅ Use custom auth hook
  console.log("inside chat page "+currentUser);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Your Chats</Card.Header>
            <Card.Body>
              {currentUser ? (
                <ChatList currentUser={currentUser.username} onSelectChat={setSelectedChat} />
              ) : (
                <p className="text-danger">Error: No user found. Please log in again.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {selectedChat && currentUser ? (
            <ChatWindow chatId={selectedChat} currentUser={currentUser.username} />
          ) : (
            <p>Select a chat to start messaging</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
