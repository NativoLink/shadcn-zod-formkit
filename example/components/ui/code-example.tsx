"use client"; // si usas Next.js App Router
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import { Badge } from "./badge";

interface CodeBlockShikiProps {
  code: string;
  language?: string;
}

export const CodeExample = ({ code, language = "ts" }: CodeBlockShikiProps) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const loadHighlighter = async () => {
      const highlighter = await createHighlighter({
        themes: ["slack-dark"], // tema
        langs: ["ts", "javascript", "css"], // agrega más si quieres
      });

      const codeHtml = highlighter.codeToHtml(code, {
        lang: language,
        theme: "slack-dark",
      });

      setHtml(codeHtml);
    };

    loadHighlighter();
  }, [code, language]);

  const lineCount = code.split(/\r\n|\r|\n/).length;
  return (
    <>
      <Badge variant="default" className='text-xl'>Total Lines: {lineCount}</Badge>
      <ScrollArea className="h-200 w-full rounded-md border">
      <div
        className="overflow-auto rounded text-xs h-full" 
        dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </>
  );
};
