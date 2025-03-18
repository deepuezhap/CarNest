    const  ChatWindow = ({ chatId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
  
    useEffect(() => {
      if (!chatId) {
        console.warn("No chat selected.");
        return;
      }
  
      console.log("Loading messages for chat:", chatId); // ✅ Debugging log
  
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp"));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Messages received:", fetchedMessages); // ✅ Debugging log
        setMessages(fetchedMessages);
      });
  
      return () => unsubscribe();
    }, [chatId]);
  
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