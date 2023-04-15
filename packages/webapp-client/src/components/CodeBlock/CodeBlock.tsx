import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const codeString = typeof children === 'string' ? children : '';
  const language = className?.replace(/language-/, '');
  if (!language) {
    return <span>{codeString}</span>;
  }

  return (
    <div className={styles.code}>
      <SyntaxHighlighter
        wrapLongLines
        language={language || 'javascript'}
        style={tomorrowNight}
        customStyle={{ padding: '1rem', overflow: 'hidden' }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
