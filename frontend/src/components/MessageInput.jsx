import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

const MessageInput = ({ onSend }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
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
            textareaRef.current.style.height = 'auto';
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full pt-4 md:pt-10 pb-2 md:pb-4 px-3 md:px-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-800 dark:via-gray-800/80 dark:to-transparent pointer-events-none">
            <div className="max-w-3xl mx-auto pointer-events-auto">
                <div className={`
                    relative flex items-end w-full transition-all duration-300 ease-in-out
                    bg-white/70 dark:bg-gray-700/70 backdrop-blur-xl
                    border-2 rounded-2xl p-2 pr-3 pl-4 
                    shadow-lg hover:shadow-xl dark:shadow-none
                    ${input
                        ? 'border-blue-400 dark:border-blue-500 ring-4 ring-blue-500/10'
                        : 'border-gray-200 dark:border-gray-600 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10'}
                `}>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        rows={1}
                        className="flex-1 max-h-[200px] py-3 pr-2 resize-none bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                    />

                    <div className="flex items-center gap-2 pb-1.5">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                            <Paperclip size={20} />
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`
                                p-2.5 rounded-xl transition-all duration-300 transform active:scale-95
                                ${input.trim()
                                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-blue-500/40'
                                    : 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            <Send size={18} className={input.trim() ? "animate-in fade-in zoom-in duration-300" : ""} />
                        </button>
                    </div>
                </div>
                <p className="text-[12px] text-center mt-3 text-gray-400 dark:text-gray-500 px-4">
                    Gemini can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
};

export default MessageInput;
