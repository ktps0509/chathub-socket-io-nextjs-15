import Image from 'next/image';
import React, { useState } from 'react';



const ChatForm = ({
    onSendMessage
}: {
    onSendMessage: (message: string) => void;
}) => {
    const [message, setMessage] = useState('');
    const handleSumitMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message.trim() !== "") {
            onSendMessage(message)
            setMessage('');
        }
    }

    return (
        <form
            onSubmit={handleSumitMessage}
            className='flex items-center gap-2 w-full'
        >
            <input
                type="text"
                placeholder="Type something here..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="border border-gray-300 rounded-md p-2 w-full"
            />
            <button
                type="submit"
                className="bg-blue-500 border h-full  text-white rounded-md p-2 cursor-pointer"
                disabled={!message}
            >
                <Image
                    src="/images/send-icon.svg"
                    alt="send"
                    width={20}
                    height={20}
                    className="text-white"
                />
            </button>
        </form>
    )
}

export default ChatForm;