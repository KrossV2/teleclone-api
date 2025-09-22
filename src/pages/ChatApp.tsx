import { useState, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { apiService } from '@/services/api';
import { Chat, Message, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ChatAppProps {
  currentUser: User;
  onLogout: () => void;
}

export const ChatApp = ({ currentUser, onLogout }: ChatAppProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    }
  }, [currentChat]);

  const loadChats = async () => {
    try {
      const result = await apiService.getPrivateChats(currentUser.id);
      if (result.success) {
        setChats(result.data || []);
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Chatlarni yuklashda xatolik",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const result = await apiService.getChatMessages(chatId);
      if (result.success) {
        setMessages(result.data || []);
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Xabarlarni yuklashda xatolik",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (content: string, type: string = 'text') => {
    if (!currentChat) return;

    try {
      const result = await apiService.sendPrivateMessage({
        ChatId: currentChat.id,
        Content: content,
        MessageType: type as 'text' | 'image' | 'file' | 'voice' | 'video'
      });

      if (result.success && result.data) {
        setMessages(prev => [...prev, result.data]);
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Xabar yuborishda xatolik",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentChat) return;

    try {
      const result = await apiService.uploadFile(currentChat.id, file);
      if (result.success) {
        toast({
          title: "Muvaffaqiyat!",
          description: "Fayl yuklandi"
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Fayl yuklashda xatolik",
        variant: "destructive"
      });
    }
  };

  const handleStartCall = async (type: 'voice' | 'video') => {
    if (!currentChat || currentChat.type !== 'private') return;

    const otherParticipant = currentChat.participants?.find(p => p.user_id !== currentUser.id);
    if (!otherParticipant) return;

    try {
      const result = await apiService.startCall({
        ReceiverId: otherParticipant.user_id,
        Type: type
      });

      if (result.success) {
        toast({
          title: "Qo'ng'iroq boshlanmoqda...",
          description: `${type === 'voice' ? 'Ovozli' : 'Video'} qo'ng'iroq`
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik!",
        description: "Qo'ng'iroq qilishda xatolik",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        currentUser={currentUser}
        onChatSelect={setCurrentChat}
        onNewChat={() => {}}
        onCreateGroup={() => {}}
      />
      
      <div className="flex-1">
        {currentChat ? (
          <ChatWindow
            chat={currentChat}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onStartCall={handleStartCall}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-chat-background">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Telegram Clone
              </h2>
              <p className="text-muted-foreground">
                Suhbatni boshlash uchun chat tanlang
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};