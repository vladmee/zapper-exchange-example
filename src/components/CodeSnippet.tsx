import React, { useState, useRef } from 'react';

interface CodeSnippetProps {
  children: React.ReactNode;
  label: string;
  copyText: string;
}

// This is a pure utility component to display the bash commands when interacting with anvil.
const CodeSnippet: React.FC<CodeSnippetProps> = ({ children, label, copyText }) => {
  const [copied, setCopied] = useState(false);
  const snippetRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <h4 className="font-bold mt-4">{label}:</h4>
      <div className="relative flex items-center">
        <div className="flex-1 flex items-center">
          <div
            ref={snippetRef}
            className={`block p-2 rounded-md bg-gray-800 text-white`}
            style={{ overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            {children}
          </div>
          <button
            onClick={handleCopy}
            className="ml-2 p-2 bg-blue-500 text-white rounded-md w-24"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CodeSnippet;
