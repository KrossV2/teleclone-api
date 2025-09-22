# Backend API Setup Guide

Bu loyiha C# .NET Core Clean Architecture backend bilan ishlaydi.

## Backend Repository
https://github.com/KrossV2/Telegram_V2

## Quick Setup

1. **Backend URL ni sozlang**:
   `src/config/api.ts` faylini oching va `BASE_URL` ni o'zgartiring:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-backend-api-url.com', // <- Bu yerga backend URL ni qo'ying
  // ...
};
```

2. **Backendni ishga tushiring**:
   - Repository ni clone qiling: `git clone https://github.com/KrossV2/Telegram_V2.git`
   - Visual Studio yoki Rider da ochib, ishga tushiring
   - Odatda `https://localhost:5001` yoki `https://localhost:7001` da ishlaydi

3. **Frontend ga backend URL ni qo'ying**:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://localhost:5001', // Yoki sizning backend URL
  // ...
};
```

## API Endpoints (Backenddan olindi)

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Users
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/users/search?name={query}` 
- `POST /api/users/{id}/upload-photo`
- `POST /api/users/{userId}/block/{blockedUserId}`
- `DELETE /api/users/{userId}/unblock/{blockedUserId}`
- `GET /api/users/{userId}/blocked`

### Chats
- `POST /api/chats/private`
- `GET /api/chats/private/{userId}`
- `POST /api/chats/group`
- `GET /api/chats/group/{userId}`
- `POST /api/chats/group/{groupId}/add-user`
- `DELETE /api/chats/group/{groupId}/remove-user`
- `DELETE /api/chats/{chatId}`

### Messages
- `POST /api/messages/private`
- `GET /api/messages/{chatId}`
- `GET /api/messages/{chatId}/{messageId}`
- `PUT /api/messages/{messageId}`
- `DELETE /api/messages/{messageId}`
- `POST /api/messages/{messageId}/read`
- `GET /api/messages/{chatId}/statuses`
- `GET /api/messages/search?text={query}`
- `POST /api/messages/{messageId}/pin`
- `DELETE /api/messages/{messageId}/unpin` 
- `GET /api/messages/{chatId}/pinned`

### Files
- `POST /api/files/{chatId}/upload`
- `GET /api/files/{chatId}`
- `GET /api/files/{fileId}`
- `DELETE /api/files/{fileId}`

### Reactions
- `POST /api/messages/{messageId}/reactions`
- `GET /api/messages/{messageId}/reactions`
- `DELETE /api/messages/{messageId}/reactions/{reactionId}`

### Calls
- `POST /api/calls/start`
- `POST /api/calls/end/{callId}`
- `GET /api/calls/{userId}`

### Notifications
- `GET /api/notifications/{userId}`
- `POST /api/notifications/mark-read/{id}`

## DTO Structures (TypeScript)

Frontend DTOlari backend bilan mos:

```typescript
interface LoginDto {
  email?: string;
  username?: string;
  password: string;
}

interface RegisterDto {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface CreatePrivateChatDto {
  participant_id: string;
}

interface CreateGroupChatDto {
  name: string;
  description?: string;
  participant_ids: string[];
}

interface SendMessageDto {
  chat_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'voice' | 'video';
  reply_to?: string;
}
```

## Testing

1. Backend ishlaganini tekshirish:
   - Browser da `https://localhost:5001/swagger` ga boring
   - API endpoints ko'rinishi kerak

2. Frontend ga ulash:
   - Frontend ishga tushiring: `npm run dev`
   - Login/Register sahifasida test qiling
   - Browser Developer Tools > Network tabda API requestlar ko'ring

## CORS Settings

Backendda CORS sozlash kerak bo'lishi mumkin. `Program.cs` da:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ...

app.UseCors("AllowAll");
```

## Database

Backend SQL Server yoki PostgreSQL ishlatishi mumkin. Connection string ni `appsettings.json` da sozlang.