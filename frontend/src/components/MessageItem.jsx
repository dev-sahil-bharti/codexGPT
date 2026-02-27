import React from 'react';
import { User, Copy, Check, StepForward } from 'lucide-react';

const MessageItem = ({ message }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex w-full px-3 md:px-6 py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 md:gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className="flex-shrink-0 flex items-end mb-1">
                    <div className="relative h-8 w-8 rounded-full text-white flex items-center justify-center shadow-sm" style={{ backgroundColor: isUser ? '#7C3AED' : '#10A37F' }}>
                        {isUser ? <User size={18} /> : <StepForward size={18} />}
                    </div>
                </div>

                {/* Message Bubble */}
                <div className="relative flex flex-col group">
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base ${isUser
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
                        }`}>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                            {message.content}
                        </div>
                    </div>

                    {/* Actions - only for AI messages usually */}
                    {!isUser && (
                        <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleCopy}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
