import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

const MessageInput = ({ onSend }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        setInput(e.target.value);
        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
            <div className="mx-auto md:max-w-2xl lg:max-w-3xl md:px-4 lg:px-0 flex flex-col space-y-2 p-3 md:py-6">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    <div className="flex flex-col w-full py-2.5 flex-grow md:py-3.5 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Send a message..."
                            className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-3 md:pl-0 max-h-[200px] overflow-y-auto"
                            rows={1}
                            style={{ maxHeight: '200px' }}
                        />
                        <button
                            onClick={handleSend}
                            className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors disabled:opacity-40"
                            disabled={!input.trim()}
                        >
                            <Send size={16} className="-ml-px" />
                        </button>
                    </div>
                </div>
                <div className="px-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-[60px]">
                    <span>Running locally. ChatGPT Clone Preview.</span>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
