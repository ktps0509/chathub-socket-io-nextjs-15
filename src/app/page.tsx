"use client";
import { useEffect, useState } from 'react';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import { socket } from '@/lib/socketClient';

interface Message {
  sender: string;
  message: string;
  isOwnMessage?: boolean;
}

export default function Home() {

  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {

    socket.on('message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        data
      ]);
    })

    socket.on('user-joined', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "system", message }
      ]);
    })

    return () => {
      socket.off('user-joined');
      socket.off('message');
    }
  }, [])


  const handleJoinRoom = (room: string, userName: string) => {
    if (room.trim() !== "" || userName.trim() !== "") {
      socket.emit('join-room', { room, username: userName });
      setJoined(true)
    }
  }

  const handleSendMessage = (message: string) => {

    const data = { room, message, sender: userName }
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userName, message }
    ]);
    socket.emit('message', data);
  }

  const handleLeaveRoom = () => {
    socket.disconnect();
    setJoined(false);
    setMessages([]);
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full'>
      <h1 className='text-2xl font-bold mb-4'>Chat Room</h1>
      {joined ?
        <div className='w-full max-w-md'>
          <h1 className='text-center mb-4 font-semibold'>Room : {room}</h1>
          <div className='w-full bg-white border-2 p-5 h-48 rounded-md overflow-y-auto mb-4'>
            <ul className='flex flex-col gap-2'>
              {messages.map((msg, index) => (
                <ChatMessage key={index}
                  sender={msg.sender}
                  message={msg.message}
                  isOwnMessage={msg.sender === userName} />
              ))}
            </ul>
          </div>

          <ChatForm onSendMessage={handleSendMessage} />

          <button
            type='button'
            onClick={handleLeaveRoom}
            className="bg-red-500 text-white rounded-lg p-2 mt-2"
          >
            Leave Room
          </button>

        </div> :
        <div className='w-full max-w-md flex flex-col items-center justify-center'>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Enter room name"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
            className="border-2 border-gray-300 rounded-lg p-2 w-full mb-4"
          />
          <button
            type='button'
            onClick={() => handleJoinRoom(room, userName)}
            className="bg-blue-500 text-white rounded-lg p-2 mt-2"
          >
            Join Room
          </button>
        </div>
      }
    </div>
  );
}