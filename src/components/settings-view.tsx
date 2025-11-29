'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell, Lock, Palette, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SettingsView() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-foreground/70 mt-1">Manage your dashboard and website preferences.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for new messages</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Get weekly analytics summary</p>
              </div>
              <Switch id="weekly-reports" />
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage security settings and access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch id="two-factor" />
            </div>
            <Button variant="outline" className="w-full mt-4">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">Compact View</Label>
                <p className="text-sm text-muted-foreground">Use a more compact layout</p>
              </div>
              <Switch id="compact-view" />
            </div>
          </CardContent>
        </Card>

        {/* General Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>General website settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Analytics Tracking</Label>
                <p className="text-sm text-muted-foreground">Track page views and visitors</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Show maintenance page to visitors</p>
              </div>
              <Switch id="maintenance" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Configure advanced options. Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            These settings are coming soon. Stay tuned for more configuration options.
          </p>
          <Button variant="outline" disabled>
            Configure Advanced Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
