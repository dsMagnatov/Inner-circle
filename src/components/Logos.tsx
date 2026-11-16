import React from "react";

interface LogoProps {
  size?: number | string;
  className?: string;
}

// 1. OpenAI Wordmark
export function OpenAIWordmark({ size = 100, className = "" }: LogoProps) {
  // Map size to a proportional width/height ratio
  const width = Math.round(Number(size) * 1.1);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="OpenAI"
    >
      {/* Spiral spiral icon */}
      <path
        d="M24.7 12.3c-.4-.5-1-.9-1.7-.9H16v4.6l3.5 2.1c.5-.8.5-1.9 0-2.8l2-3.5c1.4.3 2.1 1.6 1.7 2.8z"
        opacity="0.3"
      />
      <path d="M12.4 4.5c.3 0 .7.1 1 .2l4.1-2.4c-1-.9-2.5-1.2-3.8-.7L12 5.8c.1-.8-.3-1.6-.9-2.1l2.4-4.1c1.1.2 1.9 1 1.9 2.1l-.3 3.3L13 4.5z" />
      <path d="M15 15l2-3.5-3.5-2v4.6l1.5.9z" fillOpacity="0.8" />
      {/* Icon portion - clean symbolic spiral path */}
      <circle cx="15" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 11c1 .2 1.8 1 1.8 2s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8c0-1 .8-1.8 1.8-1.8z" />
      
      {/* Wordmark typography */}
      <text
        x="32"
        y="21"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="15"
        letterSpacing="-0.025em"
      >
        OpenAI
      </text>
    </svg>
  );
}

// 2. Claude AI Wordmark
export function ClaudeAIWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.15);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 115 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="Claude AI"
    >
      {/* Playful elegant wordmark */}
      <text
        x="10"
        y="21"
        fontFamily="serif, ui-serif, Georgia"
        fontWeight="800"
        fontSize="18"
        letterSpacing="-0.01em"
      >
        Claude
      </text>
      <rect x="88" y="7" width="18" height="15" rx="3" fill="#D97706" opacity="0.8" />
      <text x="91" y="18" fontSize="9" fontFamily="sans-serif" fontWeight="900" fill="#11010a">
        AI
      </text>
    </svg>
  );
}

// 3. Replicate Wordmark
export function ReplicateWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.25);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 125 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="Replicate"
    >
      {/* Terminal brutalist logo icon */}
      <rect x="5" y="8" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 14h4v2H9z" />
      {/* Tech monospaced text */}
      <text
        x="24"
        y="20"
        fontFamily="monospace, var(--font-mono)"
        fontWeight="700"
        fontSize="14"
        letterSpacing="0.05em"
      >
        replicate
      </text>
    </svg>
  );
}

// 4. Cursor Wordmark
export function CursorWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.1);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="Cursor"
    >
      {/* Styled mouse cursor icon */}
      <path d="M8 6l9 9-4 1 3.5 6-2 1.2-3.5-6-3 3.8V6z" />
      {/* Clean high-tech lettering */}
      <text
        x="24"
        y="21"
        fontFamily="sans-serif"
        fontWeight="600"
        fontSize="16"
        letterSpacing="-0.04em"
      >
        Cursor
      </text>
    </svg>
  );
}

// 5. GitHub Wordmark
export function GithubWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.1);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="GitHub"
    >
      {/* GitHub octocat silhouette */}
      <path d="M12 5c-3.9 0-7 3.1-7 7 0 3.1 2 5.7 4.8 6.6.3.1.5-.1.5-.3v-1.2c-1.9.4-2.4-.9-2.4-.9-.3-.8-.8-1-0.8-1-.6-.4.1-.4.1-.4.7.1 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6 0-.5.2-.8.4-.9-1.5-.2-3.1-.8-3.1-3.4 0-.7.3-1.3.7-1.8 0-.2-.3-.9.1-1.8 0 0 .6-.2 1.9.7a6.7 6.7 0 013.6 0c1.3-.9 1.9-.7 1.9-.7.4.9.1 1.6.1 1.8.4.5.7 1.1.7 1.8 0 2.6-1.6 3.2-3.1 3.4.2.2.5.7.5 1.4v2.1c0 .2.2.5.5.4A7 7 0 0019 12c0-3.9-3.1-7-7-7z" />
      {/* Classic GitHub bold styling */}
      <text
        x="28"
        y="20"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="15"
        letterSpacing="-0.02em"
      >
        GitHub
      </text>
    </svg>
  );
}

// 6. Grok Wordmark
export function GrokWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.0);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="Grok"
    >
      {/* Clean slash abstract symbol + text */}
      <text
        x="10"
        y="21"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="0.05em"
      >
        grok
      </text>
      <rect x="68" y="10" width="12" height="12" transform="rotate(45 74 16)" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

// 7. Google Wordmark
export function GoogleWordmark({ size = 100, className = "" }: LogoProps) {
  const width = Math.round(Number(size) * 1.15);
  const height = Math.round(Number(size) * 0.3);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 115 30"
      fill="currentColor"
      className={`text-white transition-opacity hover:opacity-80 ${className}`}
      aria-label="Google"
    >
      {/* Perfectly styled classic Product Sans Google typography */}
      <text
        x="10"
        y="21"
        fontFamily="'Product Sans', sans-serif, 'Helvetica Neue'"
        fontWeight="500"
        fontSize="18"
        letterSpacing="-0.05em"
      >
        Google
      </text>
    </svg>
  );
}
