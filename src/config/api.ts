// API Configuration
export const API_CONFIG = {
  // Backend API URL ni shu yerga qo'ying
  BASE_URL: process.env.REACT_APP_API_URL || 'https://your-backend-api-url.com',
  
  // API endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    
    // Users
    USERS: '/api/users',
    USER_SEARCH: '/api/users/search',
    USER_UPLOAD_PHOTO: '/api/users/{id}/upload-photo',
    USER_BLOCK: '/api/users/{userId}/block/{blockedUserId}',
    USER_UNBLOCK: '/api/users/{userId}/unblock/{blockedUserId}',
    USER_BLOCKED_LIST: '/api/users/{userId}/blocked',
    
    // Chats
    PRIVATE_CHATS: '/api/chats/private',
    GROUP_CHATS: '/api/chats/group',
    GROUP_ADD_USER: '/api/chats/group/{groupId}/add-user',
    GROUP_REMOVE_USER: '/api/chats/group/{groupId}/remove-user',
    
    // Messages
    SEND_PRIVATE_MESSAGE: '/api/messages/private',
    CHAT_MESSAGES: '/api/messages/{chatId}',
    MESSAGE_SEARCH: '/api/messages/search',
    MESSAGE_PIN: '/api/messages/{messageId}/pin',
    MESSAGE_UNPIN: '/api/messages/{messageId}/unpin',
    MESSAGE_PINNED: '/api/messages/{chatId}/pinned',
    MESSAGE_READ: '/api/messages/{messageId}/read',
    MESSAGE_STATUSES: '/api/messages/{chatId}/statuses',
    MESSAGE_REACTIONS: '/api/messages/{messageId}/reactions',
    
    // Files
    FILE_UPLOAD: '/api/files/{chatId}/upload',
    CHAT_FILES: '/api/files/{chatId}',
    FILE_DELETE: '/api/files/{fileId}',
    
    // Calls
    CALL_START: '/api/calls/start',
    CALL_END: '/api/calls/end/{callId}',
    CALL_HISTORY: '/api/calls/{userId}',
    
    // Notifications
    NOTIFICATIONS: '/api/notifications/{userId}',
    NOTIFICATION_READ: '/api/notifications/mark-read/{id}',
  }
};

// Helper function to replace URL parameters
export const replaceUrlParams = (url: string, params: Record<string, string>): string => {
  let replacedUrl = url;
  Object.entries(params).forEach(([key, value]) => {
    replacedUrl = replacedUrl.replace(`{${key}}`, value);
  });
  return replacedUrl;
};