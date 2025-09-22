# Telegram Clone

Bu loyiha React + TypeScript + Tailwind CSS yordamida yaratilgan Telegram klonidir.

## Xususiyatlar

- ✅ Autentifikatsiya (Login/Register) 
- ✅ Real-time chat
- ✅ Private va Group chatlari
- ✅ Fayl yuklash va media
- ✅ Xabar qidirish
- ✅ Reaksiyalar (Emoji)
- ✅ Voice/Video qo'ng'iroqlar tarixi
- ✅ Push bildirishnomalar
- ✅ Responsive design

## Backend API

Loyiha C# .NET Core Clean Architecture backend bilan ishlaydi. API endpoints:

### Auth
- `POST /api/auth/login` - Tizimga kirish
- `POST /api/auth/register` - Ro'yxatdan o'tish  
- `POST /api/auth/logout` - Tizimdan chiqish

### Users
- `GET /api/users` - Barcha foydalanuvchilar
- `GET /api/users/{id}` - Bitta foydalanuvchi
- `PUT /api/users/{id}` - Foydalanuvchi ma'lumotlarini o'zgartirish
- `DELETE /api/users/{id}` - Foydalanuvchini o'chirish
- `GET /api/users/search?name={query}` - Foydalanuvchilarni qidirish
- `POST /api/users/{id}/upload-photo` - Profil rasmini yuklash
- `POST /api/users/{userId}/block/{blockedUserId}` - Bloklash
- `DELETE /api/users/{userId}/unblock/{blockedUserId}` - Blokdan chiqarish

### Chats  
- `POST /api/chats/private` - Private chat yaratish
- `GET /api/chats/private/{userId}` - Private chatlar ro'yxati
- `POST /api/chats/group` - Group chat yaratish
- `GET /api/chats/group/{userId}` - Group chatlar ro'yxati
- `POST /api/chats/group/{groupId}/add-user` - Guruhga qo'shish
- `DELETE /api/chats/group/{groupId}/remove-user` - Guruhdan chiqarish

### Messages
- `POST /api/messages/private` - Xabar yuborish
- `GET /api/messages/{chatId}` - Chat xabarlari
- `PUT /api/messages/{messageId}` - Xabarni tahrirlash
- `DELETE /api/messages/{messageId}` - Xabarni o'chirish
- `GET /api/messages/search?text={query}` - Xabarlarni qidirish
- `POST /api/messages/{messageId}/pin` - Xabarni pin qilish
- `POST /api/messages/{messageId}/read` - O'qilgan deb belgilash

### Files
- `POST /api/files/{chatId}/upload` - Fayl yuklash
- `GET /api/files/{chatId}` - Chat fayllari
- `DELETE /api/files/{fileId}` - Faylni o'chirish

### Reactions
- `POST /api/messages/{messageId}/reactions` - Reaksiya qo'shish
- `GET /api/messages/{messageId}/reactions` - Reaksiyalar ro'yxati
- `DELETE /api/messages/{messageId}/reactions/{reactionId}` - Reaksiyani o'chirish

### Calls
- `POST /api/calls/start` - Qo'ng'iroq boshlash
- `POST /api/calls/end/{callId}` - Qo'ng'iroqni tugatish
- `GET /api/calls/{userId}` - Qo'ng'iroqlar tarixi

### Notifications
- `GET /api/notifications/{userId}` - Bildirishnomalar
- `POST /api/notifications/mark-read/{id}` - O'qilgan deb belgilash

## Backend API o'rnatish

1. Backend URL ni sozlang:
   `src/config/api.ts` faylida `BASE_URL` ni o'zgartiring:
   ```typescript
   BASE_URL: 'https://your-backend-api-url.com'
   ```

2. Backend repositoriyasi: https://github.com/KrossV2/Telegram_V2

## O'rnatish

1. Repository ni clone qiling:
```bash
git clone https://github.com/yourusername/telegram-clone.git
cd telegram-clone
```

2. Dependencies o'rnating:
```bash
npm install
```

3. Loyihani ishga tushiring:
```bash
npm run dev
```

## Texnologiyalar

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Query
- **Routing**: React Router
- **Backend Integration**: Fetch API
- **Build Tool**: Vite

## Loyiha strukturasi

```
src/
├── components/          # React komponentlar
│   ├── auth/           # Autentifikatsiya komponentlari
│   ├── chat/           # Chat komponentlari  
│   └── ui/             # UI komponentlar (shadcn/ui)
├── pages/              # Sahifalar
├── services/           # API servislar
├── types/              # TypeScript turlari
├── config/             # Konfiguratsiya
└── lib/                # Yordamchi kutubxonalar
```

## Backend Repository

Backend kodlari: https://github.com/KrossV2/Telegram_V2

C# .NET Core Clean Architecture asosida qurilgan.