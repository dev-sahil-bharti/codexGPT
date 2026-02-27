import React, { useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import Navbar from './Navbar';

const ChatWindow = ({ messages, onSend, toggleSidebar }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col relative h-full w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">

            {/* Navbar (handles mobile menu toggle too) */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto w-full pb-32 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
                        <h2 className="text-2xl md:text-4xl font-semibold mb-2 text-gray-700 dark:text-gray-300 px-4">What’s on the agenda today?</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm px-6">
                            Start a new conversation or select a previous chat from the sidebar to continue.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageItem key={index} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <MessageInput onSend={onSend} />
        </div>
    );
};

export default ChatWindow;
