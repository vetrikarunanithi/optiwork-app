import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(username.trim(), password.trim());
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-400/10 dark:bg-slate-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-300/10 dark:bg-slate-700/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-industrial-lg border-2 relative animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-2xl flex items-center justify-center shadow-industrial-lg transform hover:scale-105 transition-transform">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Optiwork Admin</CardTitle>
            <CardDescription className="mt-2 text-base">
              Supervisor and Manager Access
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 text-base touch-target"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 text-base touch-target"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 dark:from-slate-600 dark:to-slate-800 dark:hover:from-slate-500 dark:hover:to-slate-700 touch-target"
              disabled={isLoading || !username.trim() || !password.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Login
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-3">Demo Credentials:</div>
              <div className="p-3 rounded-lg bg-muted border border-border">
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <code className="px-2 py-0.5 rounded bg-background border text-foreground">admin</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <code className="px-2 py-0.5 rounded bg-background border text-foreground">admin123</code>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <p className="text-xs text-center text-amber-800 dark:text-amber-400">
              🔐 Administrative access - Authorized personnel only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
