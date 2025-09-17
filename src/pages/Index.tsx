import { useState, useEffect } from 'react';
import { Auth } from './Auth';
import { ChatApp } from './ChatApp';
import { User } from '@/types';
import { apiService } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Settings, Globe } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedApiUrl = localStorage.getItem('api_url');
    if (savedApiUrl) {
      setApiUrl(savedApiUrl);
      apiService.setBaseUrl(savedApiUrl);
      setShowApiSetup(false);
    }
    if (token) {
      apiService.setToken(token);
      // In a real app, you'd validate the token here
    }
  }, []);

  const handleApiUrlSet = () => {
    if (apiUrl.trim()) {
      localStorage.setItem('api_url', apiUrl);
      apiService.setBaseUrl(apiUrl);
      setShowApiSetup(false);
    }
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('auth_token');
    apiService.logout();
  };

  if (showApiSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Telegram Clone</CardTitle>
            <p className="text-muted-foreground">API URL ni kiriting</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Base URL</label>
              <Input
                type="url"
                placeholder="https://your-api.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="h-11"
              />
            </div>
            <Button 
              onClick={handleApiUrlSet} 
              className="w-full h-11"
              disabled={!apiUrl.trim()}
            >
              <Globe className="h-4 w-4 mr-2" />
              Davom etish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return <ChatApp currentUser={currentUser} onLogout={handleLogout} />;
};

export default Index;