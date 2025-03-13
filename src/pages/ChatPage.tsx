import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'star';
  senderImage?: string;
  timestamp: any;
}

const ChatPage = () => {
  const { starId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [starData, setStarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch star data
  useEffect(() => {
    const fetchStarData = async () => {
      if (starId) {
        const starDoc = await getDoc(doc(db, 'stars', starId));
        if (starDoc.exists()) {
          setStarData(starDoc.data());
        }
      }
    };
    fetchStarData();
  }, [starId]);

  useEffect(() => {
    if (!auth.currentUser || !starId) return;

    const chatId = [auth.currentUser.uid, starId].sort().join('_');

    // Fetch messages
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [starId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    const chatId = [auth.currentUser.uid, starId].sort().join('_');
    const isUserStar = auth.currentUser.uid === starId;

    try {
      // Create message with enhanced details
      await addDoc(collection(db, 'messages'), {
        chatId,
        text: newMessage,
        senderId: auth.currentUser.uid,
        senderName: isUserStar ? starData?.name : user?.displayName || user?.email,
        senderType: isUserStar ? 'star' : 'user',
        senderImage: isUserStar ? starData?.profilePicture : null,
        timestamp: serverTimestamp(),
      });

      // Update chat document
      const chatsRef = collection(db, 'chats');
      await addDoc(chatsRef, {
        participants: [auth.currentUser.uid, starId],
        lastMessage: newMessage,
        lastSenderName: isUserStar ? starData?.name : user?.displayName || user?.email,
        updatedAt: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-4">
        {starData && (
          <div className="flex items-center">
            {starData.profilePicture && (
              <img 
                src={starData.profilePicture} 
                alt={starData.name} 
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <h1 className="text-2xl font-bold">{starData.name}</h1>
          </div>
        )}
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow h-[60vh] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === auth.currentUser?.uid
                ? 'ml-auto'
                : ''
            }`}
          >
            <div
              className={`flex items-start gap-2 ${
                message.senderId === auth.currentUser?.uid
                  ? 'flex-row-reverse'
                  : ''
              }`}
            >
              {message.senderImage ? (
                <img 
                  src={message.senderImage} 
                  alt={message.senderName} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {message.senderName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.senderId === auth.currentUser?.uid
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                <p className="text-sm font-medium mb-1">{message.senderName}</p>
                <p>{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
