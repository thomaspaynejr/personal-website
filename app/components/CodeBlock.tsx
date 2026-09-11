'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

// Token types for monochromatic high-contrast syntax styling
type TokenType = 'keyword' | 'string' | 'comment' | 'type' | 'number' | 'function' | 'text';

interface Token {
  type: TokenType;
  text: string;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const KEYWORDS = new Set([
    'import', 'export', 'from', 'default', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'typeof',
    'instanceof', 'async', 'await', 'interface', 'type', 'class', 'extends',
    'implements', 'as', 'in', 'of', 'select', 'insert', 'update', 'delete',
    'where', 'create', 'table', 'alter', 'drop', 'on', 'true', 'false', 'null', 'undefined'
  ]);

  while (i < line.length) {
    // Single line comments
    if ((line[i] === '/' && line[i + 1] === '/') || (line[i] === '-' && line[i + 1] === '-') || (line[i] === '#' && i === 0)) {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }

    // Strings (single, double, or backtick)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length) {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
          continue;
        }
        str += line[i];
        if (line[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // Numbers
    if (/\d/.test(line[i]) && (i === 0 || /[\s,()\[\]{}=+\-*/<>]/.test(line[i - 1]))) {
      let num = '';
      while (i < line.length && /[\d.a-fA-Fx]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', text: num });
      continue;
    }

    // Identifiers and Keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let word = '';
      while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
        word += line[i];
        i++;
      }

      // Check if followed by ( indicating function call
      let j = i;
      while (j < line.length && line[j] === ' ') j++;
      const isFn = line[j] === '(';

      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(word)) {
        tokens.push({ type: 'type', text: word });
      } else if (isFn) {
        tokens.push({ type: 'function', text: word });
      } else {
        tokens.push({ type: 'text', text: word });
      }
      continue;
    }

    // Other characters (operators, whitespace, punctuation)
    tokens.push({ type: 'text', text: line[i] });
    i++;
  }

  return tokens;
}

export default function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const displayLang = (language || 'CODE').toUpperCase();

  return (
    <div className="relative my-6 rounded-xl border border-border-custom/40 bg-card/60 backdrop-blur-md overflow-hidden font-mono shadow-sm group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-custom/30 bg-background/40 text-[10px] text-accent select-none">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-action opacity-80" />
          <span className="font-bold tracking-widest uppercase">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-card hover:bg-border-custom/30 text-[9px] font-bold uppercase tracking-wider text-action transition-all cursor-none active:scale-95 border border-border-custom/30"
        >
          {copied ? (
            <>
              <Check size={11} className="text-green-500 animate-in zoom-in-50" />
              <span className="text-green-500">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={11} className="opacity-70 group-hover:opacity-100" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="overflow-x-auto p-4 text-[11px] leading-relaxed">
        <pre className="table w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const tokens = tokenizeLine(line);
              return (
                <tr key={idx} className="hover:bg-background/30 transition-colors">
                  <td className="table-cell pr-4 select-none text-right text-[10px] text-accent/40 font-mono w-8">
                    {idx + 1}
                  </td>
                  <td className="table-cell pl-2 font-mono whitespace-pre text-foreground/90">
                    {tokens.map((tok, tIdx) => {
                      switch (tok.type) {
                        case 'keyword':
                          return (
                            <span key={tIdx} className="text-action font-semibold">
                              {tok.text}
                            </span>
                          );
                        case 'type':
                          return (
                            <span key={tIdx} className="text-accent font-medium underline-offset-2">
                              {tok.text}
                            </span>
                          );
                        case 'string':
                          return (
                            <span key={tIdx} className="text-accent/90 italic">
                              {tok.text}
                            </span>
                          );
                        case 'comment':
                          return (
                            <span key={tIdx} className="text-accent/50 italic">
                              {tok.text}
                            </span>
                          );
                        case 'function':
                          return (
                            <span key={tIdx} className="text-foreground font-medium">
                              {tok.text}
                            </span>
                          );
                        case 'number':
                          return (
                            <span key={tIdx} className="text-action font-mono">
                              {tok.text}
                            </span>
                          );
                        default:
                          return <span key={tIdx}>{tok.text}</span>;
                      }
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </pre>
      </div>
    </div>
  );
}
