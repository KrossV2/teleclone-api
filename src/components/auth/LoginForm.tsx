import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Send, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess: (user: any, token: string) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await apiService.login({
        Email: formData.email,
        Password: formData.password
      });
      if (result.success && result.data) {
        apiService.setToken(result.data.Token);
        onSuccess(result.data.User, result.data.Token);
        toast({ title: "Muvaffaqiyatli kirish!", description: "Xush kelibsiz!" });
      } else {
        toast({ 
          title: "Xatolik!", 
          description: result.message || "Login ma'lumotlari noto'g'ri",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Xatolik!", 
        description: "Server bilan bog'lanishda xatolik",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-primary">Kirish</CardTitle>
        <CardDescription>Hisobingizga kiring</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email yoki Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Parol</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Yuklanmoqda...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Kirish
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Hisobingiz yo'qmi?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-primary hover:text-primary-hover"
              onClick={onSwitchToRegister}
            >
              Ro'yxatdan o'ting
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};