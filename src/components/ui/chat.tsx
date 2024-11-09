// /components/ui/chat.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "./file-upload";
import { Send, ImagePlus, Loader2, Minimize2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface ChatProps {
  userId?: string;
  userName?: string;
  initialMessages?: Message[];
}

export const Chat = ({ userId, userName, initialMessages = [] }: ChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded, scrollToBottom]);

  const toggleChat = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const clearChatHistory = useCallback(() => {
    setMessages([]);
    toast({
      title: "Chat history cleared",
      description: "Your chat history has been cleared from view",
    });
  }, [toast]);

  const handleSend = async () => {
    if (!input.trim() && (!files || files.length === 0)) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    try {
      // Handle file uploads if present
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('message', input);

        const response = await fetch('/api/ai/vision', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to analyze images');

        const data = await response.json();
        newMessage.attachments = data.urls;
      }

      setMessages(prev => [...prev, newMessage]);
      setInput("");
      setFiles(null);

      // Get AI response
      const aiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          attachments: newMessage.attachments,
          userId,
        }),
      });

      if (!aiResponse.ok) throw new Error('Failed to get response');

      const aiData = await aiResponse.json();
      
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: aiData.message,
        timestamp: new Date().toISOString(),
      }]);

      scrollToBottom();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg z-50",
        "flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-[50vw] h-[90vh]" : "w-[120px] h-[48px] cursor-pointer"
      )}
      onClick={() => !isExpanded && toggleChat()}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b bg-background">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/logos/logo-avatar-no-bg.png" alt="Coan" />
            <AvatarFallback>Co</AvatarFallback>
          </Avatar>
          {isExpanded ? (
            <h1 className="brand-text truncate">
              <span className="text-black">Assistant Co</span>
              <span className="text-[#FFB800]">an</span>
            </h1>
          ) : (
            <span className="brand-text truncate">Chat</span>
          )}
        </div>
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChatHistory}
              className="flex-shrink-0"
              title="Clear chat history"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="flex-shrink-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4 py-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 items-start",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/logos/logo-avatar-no-bg.png" alt="Coan" />
                      <AvatarFallback>Co</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[80%] break-words",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.attachments?.map((url, index) => (
                      <div key={`${message.id}-attachment-${index}`} className="mb-2">
                        <Image
                          src={url}
                          alt="Attached image"
                          width={200}
                          height={200}
                          className="rounded"
                        />
                      </div>
                    ))}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={`https://avatar.vercel.sh/${userName}`} />
                      <AvatarFallback>
                        {userName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t mt-auto bg-background">
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={{
                accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
                maxFiles: 3,
                maxSize: 5 * 1024 * 1024,
              }}
            >
              <FileInput className="mb-2">
                <div className="p-2 border-2 border-dashed rounded-lg text-center">
                  <ImagePlus className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop images here or click to upload
                  </p>
                </div>
              </FileInput>
              {files && files.length > 0 && (
                <FileUploaderContent>
                  {files.map((file, index) => (
                    <FileUploaderItem key={`file-${index}`} index={index}>
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {file.name}
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              )}
            </FileUploader>

            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};