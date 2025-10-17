import { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Briefcase, ChevronRight, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

interface EmployeeLoginProps {
  onLogin: (user: User) => void;
  employees: User[];
}

export function EmployeeLogin({ onLogin, employees = [] }: EmployeeLoginProps) {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  if (!employees || employees.length === 0) {
    setError('No employees available. Please try again later.');
    return;
  }
  
  const employee = employees.find(emp => emp.employeeId === employeeId.toUpperCase());
  
  if (!employee) {
    setError('Invalid Employee ID');
    return;
  }

  // Check password matches
  if (employee.password && employee.password !== password) {
    setError('Invalid Password');
    return;
  }
  
  if (!employee.password && !password) {
    setError('Please enter a password');
    return;
  }
  
  onLogin(employee); 
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-industrial-lg border-2 relative animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-industrial-lg transform hover:scale-105 transition-transform">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Optiwork Employee</CardTitle>
            <CardDescription className="mt-2 text-base">
              Enter your credentials to access your tasks
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-base">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                placeholder="Enter your Employee ID (e.g., EMP001)"
                value={employeeId || ''}
                onChange={(e) => setEmployeeId(e.target.value || '')}
                className="h-14 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password || ''}
                  onChange={(e) => setPassword(e.target.value || '')}
                  className="h-14 text-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-14 text-lg gradient-primary">
              Login
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          {employees && employees.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">Sample Employee IDs for Testing:</p>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-thin">
                {employees.slice(0, 10).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => {
                    setEmployeeId(emp.employeeId || '');
                    setPassword(emp.password || 'demo123');
                  }}
                  className="text-xs px-4 py-3 bg-muted hover:bg-accent rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-semibold text-sm mb-1">{emp.employeeId}</div>
                      <div className="text-muted-foreground truncate">{emp.name}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{emp.department}</span>
                        <span>•</span>
                        <span>{emp.shift} Shift</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Click any employee to auto-fill. Password: <span className="font-mono font-semibold">demo123</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
