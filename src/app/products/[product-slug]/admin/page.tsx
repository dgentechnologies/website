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
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

const DEFAULT_SETTINGS: ModelSettings = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
};

// Map product slugs to their model paths
const MODEL_PATHS: Record<string, string> = {
  'auralis-ecosystem': '/models/auralis-desktop.glb',
  // Add more products here as needed
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
          rotationX: data.rotationX ?? DEFAULT_SETTINGS.rotationX,
          rotationY: data.rotationY ?? DEFAULT_SETTINGS.rotationY,
          rotationZ: data.rotationZ ?? DEFAULT_SETTINGS.rotationZ,
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

  const getOrientation = () => {
    return `${settings.rotationX}deg ${settings.rotationY}deg ${settings.rotationZ}deg`;
  };

  // Get model path for the current product
  const modelPath = MODEL_PATHS[productSlug] || '/models/auralis-desktop.glb';

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
              <CardTitle>3D Model Rotation</CardTitle>
              <CardDescription>
                Rotate the model on X, Y, Z axes. Use camera controls to zoom and drag/move the view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rotation X */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rotationX">Rotation X-Axis (Pitch)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.rotationX}°
                  </span>
                </div>
                <Slider
                  id="rotationX"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.rotationX]}
                  onValueChange={([value]) => setSettings({ ...settings, rotationX: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tilts the model forward/backward (-180° to 180°)
                </p>
              </div>
              {/* Rotation Y */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rotationY">Rotation Y-Axis (Yaw)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.rotationY}°
                  </span>
                </div>
                <Slider
                  id="rotationY"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.rotationY]}
                  onValueChange={([value]) => setSettings({ ...settings, rotationY: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Spins the model left/right (-180° to 180°)
                </p>
              </div>

              {/* Rotation Z */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rotationZ">Rotation Z-Axis (Roll)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.rotationZ}°
                  </span>
                </div>
                <Slider
                  id="rotationZ"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.rotationZ]}
                  onValueChange={([value]) => setSettings({ ...settings, rotationZ: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tilts the model side to side (-180° to 180°)
                </p>
              </div>

              {/* Orientation String */}
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <Label>Model Orientation (X Y Z)</Label>
                <code className="text-sm font-mono block break-all">
                  {getOrientation()}
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

          {/* Preview with Model and Text */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview with Content</CardTitle>
              <CardDescription>
                Drag and zoom the 3D model. Position it alongside the website text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
                {/* Split layout matching the actual product page */}
                <div className="grid grid-cols-2 gap-4 min-h-[500px]">
                  {/* Left: 3D Model */}
                  <div className="relative">
                    <Model3DViewer
                      src={modelPath}
                      alt="3D Model Preview"
                      autoRotate={false}
                      cameraControls={true}
                      orientation={getOrientation()}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>
                  
                  {/* Right: Website Text Content */}
                  <div className="flex flex-col justify-center p-6 space-y-4">
                    <h1 className="text-3xl font-bold leading-tight">
                      <span className="text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">The Brain</span>
                      <span className="block mt-2">of the Smart City</span>
                    </h1>
                    
                    <p className="text-base text-muted-foreground">
                      Intelligent. Autonomous. Mesh-Connected. Transform legacy infrastructure into smart, responsive networks.
                    </p>
                    
                    <div className="flex gap-3 pt-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Get Started
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
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
              <strong>Model Rotation:</strong> Use the X, Y, Z sliders to rotate the 3D model on each axis.
            </p>
            <div className="space-y-1 pl-4">
              <p>• <strong>X-Axis (Pitch):</strong> Tilts the model forward/backward</p>
              <p>• <strong>Y-Axis (Yaw):</strong> Spins the model left/right</p>
              <p>• <strong>Z-Axis (Roll):</strong> Tilts the model side to side</p>
            </div>
            <p className="pt-2 border-t border-border">
              <strong>Camera Controls:</strong> Use your mouse/trackpad in the preview to zoom (scroll), drag (left-click), and move the camera view.
            </p>
            <p className="pt-2 border-t border-border">
              The preview shows the model alongside the actual website text. Position the model using rotation controls and camera drag/zoom. After saving, the settings will be applied to the main product page at <code className="bg-muted px-1 rounded">/products/{productSlug}</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
