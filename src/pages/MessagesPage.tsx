import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Chat {
  id: string;
  lastMessage: string;
  lastSenderName: string;
  participants: string[];
  updatedAt: any;
  otherUserName?: string;
  otherUserImage?: string;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const uniqueChatsMap = new Map<string, Chat>();
      
      for (const doc of snapshot.docs) {
        const chatData = doc.data();
        
        // Skip chats without lastMessage
        if (!chatData.lastMessage) continue;

        const otherParticipantId = chatData.participants.find(
          (id: string) => id !== user.uid
        );

        // Use participant IDs as unique key to prevent duplicates
        const chatKey = [user.uid, otherParticipantId].sort().join('_');

        // Only add if this chat hasn't been added yet
        if (!uniqueChatsMap.has(chatKey)) {
          let userData;
          try {
            userData = await getDoc(doc(db, 'stars', otherParticipantId));
            if (!userData.exists()) {
              userData = await getDoc(doc(db, 'users', otherParticipantId));
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }

          uniqueChatsMap.set(chatKey, {
            id: doc.id,
            lastMessage: chatData.lastMessage,
            lastSenderName: chatData.lastSenderName || '',
            participants: chatData.participants,
            updatedAt: chatData.updatedAt,
            otherUserName: userData?.exists() ? userData.data().name || userData.data().username : 'Unknown User',
            otherUserImage: userData?.exists() ? userData.data().profilePicture : null
          });
        }
      }

      setChats(Array.from(uniqueChatsMap.values()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages yet</div>
          ) : (
            chats.map((chat) => (
              <Link 
                to={`/chat/${chat.participants.find(id => id !== user?.uid)}`}
                key={chat.id}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    {chat.otherUserImage ? (
                      <img
                        src={chat.otherUserImage}
                        alt={chat.otherUserName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{chat.otherUserName}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastSenderName}: {chat.lastMessage}
                      </p>
                    </div>
                    {chat.updatedAt && (
                      <div className="text-xs text-gray-500">
                        {new Date(chat.updatedAt.toDate()).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;