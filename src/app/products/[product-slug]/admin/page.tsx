'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Model3DViewer = dynamic(
  () => import('@/components/model-3d-viewer'),
  { ssr: false }
);

interface ModelSettings {
  theta: number;
  phi: number;
  radius: number;
}

const DEFAULT_SETTINGS: ModelSettings = {
  theta: 90,
  phi: 75,
  radius: 105,
};

export default function ProductAdminPage() {
  const params = useParams();
  const productSlug = params['product-slug'] as string;
  
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const docRef = doc(firestore, 'product-settings', productSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          theta: data.theta ?? DEFAULT_SETTINGS.theta,
          phi: data.phi ?? DEFAULT_SETTINGS.phi,
          radius: data.radius ?? DEFAULT_SETTINGS.radius,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [productSlug, showMessage]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const docRef = doc(firestore, 'product-settings', productSlug);
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    showMessage('success', 'Settings reset to defaults');
  };

  const getCameraOrbit = () => {
    return `${settings.theta}deg ${settings.phi}deg ${settings.radius}%`;
  };

  // Determine model path based on product slug
  const getModelPath = () => {
    // For auralis-ecosystem, use desktop model, others can be added later
    if (productSlug === 'auralis-ecosystem') {
      return '/models/auralis-desktop.glb';
    }
    // Default fallback
    return '/models/auralis-desktop.glb';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/products/${productSlug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">3D Model Configuration</h1>
              <p className="text-muted-foreground">Product: {productSlug}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Camera Position Controls</CardTitle>
              <CardDescription>
                Adjust the 3D model camera position and orientation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theta (Horizontal Rotation) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theta">Theta (Horizontal Rotation)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.theta}°
                  </span>
                </div>
                <Slider
                  id="theta"
                  min={0}
                  max={360}
                  step={1}
                  value={[settings.theta]}
                  onValueChange={([value]) => setSettings({ ...settings, theta: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the horizontal rotation around the model (0-360°)
                </p>
              </div>

              {/* Phi (Vertical Angle) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phi">Phi (Vertical Angle)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.phi}°
                  </span>
                </div>
                <Slider
                  id="phi"
                  min={0}
                  max={180}
                  step={1}
                  value={[settings.phi]}
                  onValueChange={([value]) => setSettings({ ...settings, phi: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the vertical viewing angle (0-180°)
                </p>
              </div>

              {/* Radius (Distance) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="radius">Radius (Distance)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.radius}%
                  </span>
                </div>
                <Slider
                  id="radius"
                  min={50}
                  max={200}
                  step={1}
                  value={[settings.radius]}
                  onValueChange={([value]) => setSettings({ ...settings, radius: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Controls the camera distance from the model (50-200%)
                </p>
              </div>

              {/* Camera Orbit String */}
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <Label>Camera Orbit String</Label>
                <code className="text-sm font-mono block break-all">
                  {getCameraOrbit()}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={saveSettings} 
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button 
                  onClick={resetSettings}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your changes affect the 3D model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
                <Model3DViewer
                  src={getModelPath()}
                  alt="3D Model Preview"
                  autoRotate={false}
                  cameraControls={true}
                  cameraOrbit={getCameraOrbit()}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Theta:</strong> Controls the horizontal rotation (azimuth). 0° is front view, 90° is right side, 180° is back, 270° is left side.
            </p>
            <p>
              <strong>Phi:</strong> Controls the vertical angle (elevation). 0° is top view, 90° is eye level, 180° is bottom view.
            </p>
            <p>
              <strong>Radius:</strong> Controls the camera distance. 100% is the default distance, lower values zoom in, higher values zoom out.
            </p>
            <p className="pt-2 border-t border-border">
              After saving, the settings will be applied to the main product page at <code className="bg-muted px-1 rounded">/products/{productSlug}</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
