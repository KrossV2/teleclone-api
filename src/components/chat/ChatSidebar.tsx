import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Chat, User } from '@/types';
import { Search, Plus, Users, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  chats: Chat[];
  currentChat?: Chat;
  currentUser?: User;
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  onCreateGroup: () => void;
}

export const ChatSidebar = ({ 
  chats, 
  currentChat, 
  currentUser, 
  onChatSelect, 
  onNewChat, 
  onCreateGroup 
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants?.some(p => 
      p.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Kecha';
    } else if (days < 7) {
      return date.toLocaleDateString('uz-UZ', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' });
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') return chat.name || 'Nomsiz grup';
    const otherParticipant = chat.participants?.find(p => p.user_id !== currentUser?.id);
    return otherParticipant?.user?.first_name || otherParticipant?.user?.username || 'User';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') return chat.avatar_url;
    const otherParticipant = chat.participants?.find(p => p.user_id !== currentUser?.id);
    return otherParticipant?.user?.avatar_url;
  };

  return (
    <div className={cn(
      "bg-chat-sidebar border-r border-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onNewChat}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onCreateGroup}>
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        )}
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                "hover:bg-chat-sidebar-hover",
                currentChat?.id === chat.id && "bg-chat-sidebar-active"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getChatAvatar(chat)} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {chat.type === 'group' ? <Users className="h-5 w-5" /> : getChatName(chat)[0]}
                  </AvatarFallback>
                </Avatar>
                {chat.type === 'private' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-online border-2 border-chat-sidebar rounded-full" />
                )}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {getChatName(chat)}
                    </h3>
                    {chat.last_message && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.last_message?.content || 'Xabar yo\'q'}
                    </p>
                    {chat.unread_count && chat.unread_count > 0 && (
                      <Badge variant="default" className="bg-primary text-primary-foreground min-w-[20px] h-5 text-xs">
                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      {!isCollapsed && currentUser && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser.first_name?.[0] || currentUser.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {currentUser.first_name || currentUser.username}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-status-online rounded-full" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};