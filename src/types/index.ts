export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'offline';
  last_seen?: string;
  bio?: string;
  phone?: string;
  is_blocked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  description?: string;
  avatar_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  unread_count?: number;
  is_pinned?: boolean;
  participants?: ChatParticipant[];
}

export interface ChatParticipant {
  user_id: string;
  chat_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user?: User;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'voice' | 'video';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: string;
  is_pinned: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  reactions?: Reaction[];
  read_by?: MessageStatus[];
}

export interface MessageStatus {
  message_id: string;
  user_id: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: User;
}

export interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  type: 'voice' | 'video';
  status: 'missed' | 'answered' | 'declined';
  duration?: number;
  started_at: string;
  ended_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'message' | 'call' | 'group_invite' | 'system';
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  query: string;
}