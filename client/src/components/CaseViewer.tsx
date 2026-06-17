import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function CaseViewer({ content }: { content: string }) {
  return (
    <div className="case-viewer markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
