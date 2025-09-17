import { User, Chat, Message, Call, Notification, Reaction, ApiResponse, SearchParams, PaginationParams } from '@/types';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        data: null as any, 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; username: string; password: string; first_name?: string; last_name?: string }) {
    return this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const result = await this.request('/api/auth/logout', { method: 'POST' });
    if (result.success) {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
    return result;
  }

  // Users
  async getUsers(params?: PaginationParams) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request<User[]>(`/api/users${queryString}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/api/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, { method: 'DELETE' });
  }

  async uploadProfilePhoto(id: string, file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.request<{ avatar_url: string }>(`/api/users/${id}/upload-photo`, {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async searchUsers(query: string, params?: PaginationParams) {
    const searchParams = new URLSearchParams({ name: query, ...(params as any) });
    return this.request<User[]>(`/api/users/search?${searchParams.toString()}`);
  }

  async blockUser(userId: string, blockedUserId: string) {
    return this.request(`/api/users/${userId}/block/${blockedUserId}`, { method: 'POST' });
  }

  async unblockUser(userId: string, blockedUserId: string) {
    return this.request(`/api/users/${userId}/unblock/${blockedUserId}`, { method: 'DELETE' });
  }

  async getBlockedUsers(userId: string) {
    return this.request<User[]>(`/api/users/${userId}/blocked`);
  }

  // Chats
  async createPrivateChat(participantId: string) {
    return this.request<Chat>('/api/chats/private', {
      method: 'POST',
      body: JSON.stringify({ participant_id: participantId }),
    });
  }

  async getPrivateChats(userId: string) {
    return this.request<Chat[]>(`/api/chats/private/${userId}`);
  }

  async createGroupChat(data: { name: string; description?: string; participant_ids: string[] }) {
    return this.request<Chat>('/api/chats/group', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserGroups(userId: string) {
    return this.request<Chat[]>(`/api/chats/group/${userId}`);
  }

  async addUserToGroup(groupId: string, userId: string) {
    return this.request(`/api/chats/group/${groupId}/add-user`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async removeUserFromGroup(groupId: string, userId: string) {
    return this.request(`/api/chats/group/${groupId}/remove-user`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async deleteChat(chatId: string) {
    return this.request(`/api/chats/${chatId}`, { method: 'DELETE' });
  }

  // Messages
  async sendPrivateMessage(data: { chat_id: string; content: string; message_type?: string; reply_to?: string }) {
    return this.request<Message>('/api/messages/private', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChatMessages(chatId: string, params?: PaginationParams) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request<Message[]>(`/api/messages/${chatId}${queryString}`);
  }

  async getMessage(chatId: string, messageId: string) {
    return this.request<Message>(`/api/messages/${chatId}/${messageId}`);
  }

  async updateMessage(messageId: string, content: string) {
    return this.request<Message>(`/api/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request(`/api/messages/${messageId}`, { method: 'DELETE' });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/api/messages/${messageId}/read`, { method: 'POST' });
  }

  async getMessageStatuses(chatId: string) {
    return this.request(`/api/messages/${chatId}/statuses`);
  }

  async searchMessages(query: string, params?: PaginationParams) {
    const searchParams = new URLSearchParams({ text: query, ...(params as any) });
    return this.request<Message[]>(`/api/messages/search?${searchParams.toString()}`);
  }

  async pinMessage(messageId: string) {
    return this.request(`/api/messages/${messageId}/pin`, { method: 'POST' });
  }

  async unpinMessage(messageId: string) {
    return this.request(`/api/messages/${messageId}/unpin`, { method: 'DELETE' });
  }

  async getPinnedMessages(chatId: string) {
    return this.request<Message[]>(`/api/messages/${chatId}/pinned`);
  }

  // Files
  async uploadFile(chatId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request(`/api/files/${chatId}/upload`, {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async getChatFiles(chatId: string) {
    return this.request(`/api/files/${chatId}`);
  }

  async getFile(fileId: string) {
    return this.request(`/api/files/${fileId}`);
  }

  async deleteFile(fileId: string) {
    return this.request(`/api/files/${fileId}`, { method: 'DELETE' });
  }

  // Reactions
  async addReaction(messageId: string, emoji: string) {
    return this.request<Reaction>(`/api/messages/${messageId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }

  async getMessageReactions(messageId: string) {
    return this.request<Reaction[]>(`/api/messages/${messageId}/reactions`);
  }

  async removeReaction(messageId: string, reactionId: string) {
    return this.request(`/api/messages/${messageId}/reactions/${reactionId}`, { method: 'DELETE' });
  }

  // Calls
  async startCall(data: { receiver_id: string; type: 'voice' | 'video' }) {
    return this.request<Call>('/api/calls/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async endCall(callId: string) {
    return this.request(`/api/calls/end/${callId}`, { method: 'POST' });
  }

  async getCallHistory(userId: string) {
    return this.request<Call[]>(`/api/calls/${userId}`);
  }

  // Notifications
  async getNotifications(userId: string) {
    return this.request<Notification[]>(`/api/notifications/${userId}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/api/notifications/mark-read/${id}`, { method: 'POST' });
  }
}

export const apiService = new ApiService();