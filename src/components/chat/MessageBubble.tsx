import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Check, CheckCheck, Pin, MoreHorizontal, Reply } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageBubble = ({ message, isOwn, showAvatar = true }: MessageBubbleProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    // This would normally check actual message status from read_by array
    return <CheckCheck className="h-3 w-3 text-primary" />;
  };

  return (
    <div className={cn(
      "flex gap-3 group",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {message.sender?.first_name?.[0] || message.sender?.username?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && isOwn && <div className="w-8" />}

      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender name for groups */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-primary font-medium mb-1">
            {message.sender?.first_name || message.sender?.username}
          </span>
        )}

        {/* Message bubble */}
        <div className={cn(
          "relative rounded-2xl px-4 py-2 shadow-sm",
          isOwn 
            ? "bg-chat-message-own text-primary-foreground ml-8" 
            : "bg-chat-message-other text-foreground mr-8",
          message.is_pinned && "ring-2 ring-primary/20"
        )}>
          {/* Pin indicator */}
          {message.is_pinned && (
            <Pin className="absolute -top-2 -right-2 h-4 w-4 text-primary bg-background rounded-full p-0.5" />
          )}

          {/* Reply to message */}
          {message.reply_to && (
            <div className={cn(
              "border-l-2 pl-2 mb-2 text-xs opacity-70",
              isOwn ? "border-primary-foreground/30" : "border-primary/30"
            )}>
              <p className="font-medium">Reply to message</p>
              <p className="truncate">Original message content...</p>
            </div>
          )}

          {/* Message content */}
          <div>
            {message.message_type === 'text' && (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
            
            {message.message_type === 'image' && (
              <div className="space-y-2">
                <img 
                  src={message.file_url} 
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto"
                />
                {message.content && (
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
              </div>
            )}

            {message.message_type === 'file' && (
              <div className="flex items-center gap-3 p-2 bg-black/10 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {message.file_name?.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{message.file_name}</p>
                  <p className="text-xs opacity-70">
                    {message.file_size ? `${(message.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Message footer */}
          <div className={cn(
            "flex items-center justify-between mt-1 gap-2",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}>
            <span className={cn(
              "text-xs opacity-70",
              isOwn ? "text-primary-foreground" : "text-muted-foreground"
            )}>
              {formatTime(message.created_at)}
              {message.is_edited && " • düzəldilib"}
            </span>
            
            {isOwn && (
              <div className="opacity-70">
                {getStatusIcon()}
              </div>
            )}
          </div>

          {/* Message actions */}
          <div className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            "flex items-center gap-1 bg-background border border-border rounded-lg p-1 shadow-lg",
            isOwn ? "-left-20" : "-right-20"
          )}>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Reply className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction) => (
              <Button
                key={reaction.id}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs rounded-full"
              >
                {reaction.emoji} 1
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};