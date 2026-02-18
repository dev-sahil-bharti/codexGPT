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
        <div className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${isUser ? 'dark:bg-gray-800' : 'bg-gray-50 dark:bg-[#444654]'}`}>
            <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">

                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="relative h-8 w-8 p-1 rounded-sm text-white flex items-center justify-center" style={{ backgroundColor: isUser ? '#5436DA' : '#19c37d' }}>
                        {isUser ? <User size={20} /> : <StepForward size={20} />}
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden">
                    <div className="prose dark:prose-invert min-h-[20px] whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>

                {/* Actions (Copy, etc) - only for AI messages usually, but good for both */}
                {!isUser && (
                    <div className="flex self-start items-center justify-center gap-2 visible md:invisible md:group-hover:visible">
                        <button
                            onClick={handleCopy}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageItem;
