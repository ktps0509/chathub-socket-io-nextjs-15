import React from 'react'

interface ChatMessageProps {
    sender: string;
    message: string;
    isOwnMessage: boolean;
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {

    const isSystemMessage = sender === "system";

    return (
        <div className={`flex
        ${isSystemMessage
                ? "justify-center"
                : isOwnMessage
                    ? "justify-end"
                    : "justify-start"}`} >
            <div className={`max-w-xs px-4 rounded-lg  ${isSystemMessage ? "bg-gray-200" : isOwnMessage ? "bg-blue-500" : "bg-red-300"}`}>
                <div className='text-sm text-white  '>
                    {!isSystemMessage && <p className='text-sm font-bold'>{sender}</p>}
                    {message}
                </div>
            </div>
        </div>
    )
}

export default ChatMessage