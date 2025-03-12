import React from 'react';

interface ChatPageProps {
  starName: string;
  starProfilePicture: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ starName, starProfilePicture }) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <img src={starProfilePicture} alt={starName} className="w-12 h-12 rounded-full mr-4" />
        <h1 className="text-2xl font-bold">{starName}</h1>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        {/* Chat messages will go here */}
        <p className="text-gray-700 dark:text-gray-300">Chat functionality coming soon!</p>
      </div>
    </div>
  );
};

export default ChatPage;
