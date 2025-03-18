import { useEffect, useState } from "react";
import { listenToChats } from "../../services/chatService";
import { ListGroup, Card, Spinner } from "react-bootstrap";

const ChatList = ({ currentUser, onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      console.warn("No current user found in ChatList.");
      return;
    }

    console.log("Fetching chats for:", currentUser); // ✅ Debugging log

    const unsubscribe = listenToChats(currentUser, (chatData) => {
      console.log("Chat data received:", chatData); // ✅ Debugging log
      setChats(chatData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <Card className="m-3 p-3 shadow">
      <Card.Body>
        <Card.Title>Your Chats</Card.Title>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : chats.length === 0 ? (
          <p className="text-muted">No chats yet</p>
        ) : (
          <ListGroup>
            {chats.map((chat) => {
              const receiver = chat.participants.find((p) => p !== currentUser);
              return (
                <ListGroup.Item
                  key={chat.id}
                  action
                  onClick={() => onSelectChat(chat.id)}
                >
                  <strong>Chat with {receiver}</strong>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default ChatList;
