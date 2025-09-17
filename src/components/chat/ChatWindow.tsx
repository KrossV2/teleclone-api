import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { Chat, Message, User } from '@/types';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, type?: string) => void;
  onFileUpload: (file: File) => void;
  onStartCall: (type: 'voice' | 'video') => void;
}

export const ChatWindow = ({ 
  chat, 
  messages, 
  currentUser, 
  onSendMessage, 
  onFileUpload, 
  onStartCall 
}: ChatWindowProps) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const getChatName = () => {
    if (chat.type === 'group') return chat.name || 'Nomsiz grup';
    const otherParticipant = chat.participants?.find(p => p.user_id !== currentUser.id);
    return otherParticipant?.user?.first_name || otherParticipant?.user?.username || 'User';
  };

  const getChatAvatar = () => {
    if (chat.type === 'group') return chat.avatar_url;
    const otherParticipant = chat.participants?.find(p => p.user_id !== currentUser.id);
    return otherParticipant?.user?.avatar_url;
  };

  const getOnlineStatus = () => {
    if (chat.type === 'group') return `${chat.participants?.length || 0} a'zo`;
    const otherParticipant = chat.participants?.find(p => p.user_id !== currentUser.id);
    return otherParticipant?.user?.status === 'online' ? 'Online' : 'Oxirgi faollik: bugun';
  };

  return (
    <div className="flex flex-col h-full bg-chat-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-chat-sidebar">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getChatAvatar()} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getChatName()[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{getChatName()}</h2>
            <p className="text-sm text-muted-foreground">{getOnlineStatus()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onStartCall('voice')}
            className="hover:bg-chat-sidebar-hover"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onStartCall('video')}
            className="hover:bg-chat-sidebar-hover"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-chat-sidebar-hover">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUser.id}
              showAvatar={
                index === 0 || 
                messages[index - 1].sender_id !== message.sender_id ||
                new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000
              }
            />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-sm">yozmoqda...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-chat-input">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 hover:bg-chat-sidebar-hover"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Xabar yozing..."
              className="pr-10 resize-none bg-background border-border"
              maxLength={4000}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-chat-sidebar-hover"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="shrink-0 bg-primary hover:bg-primary-hover text-primary-foreground"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};