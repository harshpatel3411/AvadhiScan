import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ui/theme-provider';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery<{ 
    id: string; 
    username: string; 
    email: string; 
    notificationsEnabled: boolean 
  }>({
    queryKey: ['/api/auth/me'],
  });
  const exportMutation = useMutation({
    mutationFn: () => apiRequest('GET', '/api/items/export'),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expirytrack_data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Success', description: 'Data exported successfully' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to export data',
        variant: 'destructive' 
      });
    },
  }); 

  const updateNotificationsMutation = useMutation({
    mutationFn: (notificationsEnabled: boolean) => 
      apiRequest('PUT', '/api/settings/notifications', { notificationsEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({ title: 'Success', description: 'Notification settings updated' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to update notification settings',
        variant: 'destructive' 
      });
    },
  });

  const testNotificationsMutation = useMutation({
    mutationFn: () => apiRequest('get', '/test-perfect-email-template'),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Notification check triggered' });
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to trigger notifications',
        variant: 'destructive' 
      });
    },
  });

  const handleNotificationToggle = (checked: boolean) => {
    updateNotificationsMutation.mutate(checked);
  };

  return (
    <MainLayout title="Settings">
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                data-testid="switch-theme"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts when items are about to expire (2 days before)
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={user?.notificationsEnabled ?? true}
                onCheckedChange={handleNotificationToggle}
                disabled={updateNotificationsMutation.isPending}
                data-testid="switch-email-notifications"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="test-notifications">Test Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Manually trigger notification check for testing
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => testNotificationsMutation.mutate()}
                disabled={testNotificationsMutation.isPending}
                data-testid="button-test-notifications"
              >
                {testNotificationsMutation.isPending ? 'Testing...' : 'Test Now'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on this device
                </p>
              </div>
              <Switch
                id="push-notifications"
                defaultChecked
                data-testid="switch-push-notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">
                Download all your data in CSV format
              </p>
             <Button
                variant="outline"
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
                data-testid="button-export"
              >
                
                Export CSV
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
              <Button variant="destructive" data-testid="button-delete-account">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
