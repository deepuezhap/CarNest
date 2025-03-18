import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// Fetch all chats for the logged-in user
export const fetchChats = async (currentUser) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", currentUser));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Listen for real-time chat updates
export const listenToChats = (currentUser, callback) => {
  console.log("Listening for chats for user:", currentUser); // ✅ Debugging log
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", currentUser));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Chats fetched:", chats); // ✅ Debugging log
    callback(chats);
  }, (error) => {
    console.error("Error listening to chats:", error);
  });
};


// Send a new message
export const sendMessage = async (chatId, sender, text) => {
  if (!text.trim()) return; // Prevent empty messages

  try {
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      sender, // Automatically include sender username
      text,
      timestamp: serverTimestamp(),
      seen: false,
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Get or create a chat between two users
export const getOrCreateChat = async (user1, user2) => {
  const chatsRef = collection(db, "chats");

  // Check if a chat already exists
  const q = query(chatsRef, where("participants", "array-contains", user1));
  const querySnapshot = await getDocs(q);

  for (const doc of querySnapshot.docs) {
    const chat = doc.data();
    if (chat.participants.includes(user2)) {
      return doc.id; // Return existing chat ID
    }
  }

  // Create a new chat if it doesn’t exist
  const newChat = await addDoc(chatsRef, {
    participants: [user1, user2],
    lastMessage: "",
    timestamp: serverTimestamp(),
  });

  return newChat.id;
};

