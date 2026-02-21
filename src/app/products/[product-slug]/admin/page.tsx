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
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  // Section 2 scroll-animation end-state
  section2RotationX: number;
  section2RotationY: number;
  section2RotationZ: number;
  section2TranslateX: number;
  section2Scale: number;
}

const DEFAULT_SETTINGS: ModelSettings = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: -60,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  section2RotationX: 0,
  section2RotationY: 0,
  section2RotationZ: -120,
  section2TranslateX: 30,
  section2Scale: 0.45,
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
          scaleX: data.scaleX ?? DEFAULT_SETTINGS.scaleX,
          scaleY: data.scaleY ?? DEFAULT_SETTINGS.scaleY,
          scaleZ: data.scaleZ ?? DEFAULT_SETTINGS.scaleZ,
          section2RotationX: data.section2RotationX ?? DEFAULT_SETTINGS.section2RotationX,
          section2RotationY: data.section2RotationY ?? DEFAULT_SETTINGS.section2RotationY,
          section2RotationZ: data.section2RotationZ ?? DEFAULT_SETTINGS.section2RotationZ,
          section2TranslateX: data.section2TranslateX ?? DEFAULT_SETTINGS.section2TranslateX,
          section2Scale: data.section2Scale ?? DEFAULT_SETTINGS.section2Scale,
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

  const getScale = () => {
    return `${settings.scaleX} ${settings.scaleY} ${settings.scaleZ}`;
  };

  const getSection2Orientation = () => {
    return `${settings.section2RotationX}deg ${settings.section2RotationY}deg ${settings.section2RotationZ}deg`;
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

              {/* Scale X */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scaleX">Scale X-Axis (Width)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.scaleX.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="scaleX"
                  min={0.1}
                  max={5}
                  step={0.01}
                  value={[settings.scaleX]}
                  onValueChange={([value]) => setSettings({ ...settings, scaleX: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Scales the model along the X axis (0.1 to 5)
                </p>
              </div>

              {/* Scale Y */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scaleY">Scale Y-Axis (Height)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.scaleY.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="scaleY"
                  min={0.1}
                  max={5}
                  step={0.01}
                  value={[settings.scaleY]}
                  onValueChange={([value]) => setSettings({ ...settings, scaleY: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Scales the model along the Y axis (0.1 to 5)
                </p>
              </div>

              {/* Scale Z */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scaleZ">Scale Z-Axis (Depth)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.scaleZ.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="scaleZ"
                  min={0.1}
                  max={5}
                  step={0.01}
                  value={[settings.scaleZ]}
                  onValueChange={([value]) => setSettings({ ...settings, scaleZ: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Scales the model along the Z axis (0.1 to 5)
                </p>
              </div>

              {/* Scale String */}
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <Label>Model Scale (X Y Z)</Label>
                <code className="text-sm font-mono block break-all">
                  {getScale()}
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
                      scale={getScale()}
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

        {/* Section 2 Scroll Animation Target */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Section 2 Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Section 2 – Scroll Animation Target</CardTitle>
              <CardDescription>
                Configure the model orientation and position when the user scrolls into the &quot;Revitalize Existing Infrastructure&quot; section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 2 Rotation X */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="section2RotationX">Rotation X-Axis (Pitch)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.section2RotationX}°
                  </span>
                </div>
                <Slider
                  id="section2RotationX"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.section2RotationX]}
                  onValueChange={([value]) => setSettings({ ...settings, section2RotationX: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tilts the model forward/backward (-180° to 180°)
                </p>
              </div>

              {/* Section 2 Rotation Y */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="section2RotationY">Rotation Y-Axis (Yaw)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.section2RotationY}°
                  </span>
                </div>
                <Slider
                  id="section2RotationY"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.section2RotationY]}
                  onValueChange={([value]) => setSettings({ ...settings, section2RotationY: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Spins the model left/right (-180° to 180°)
                </p>
              </div>

              {/* Section 2 Rotation Z */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="section2RotationZ">Rotation Z-Axis (Roll)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.section2RotationZ}°
                  </span>
                </div>
                <Slider
                  id="section2RotationZ"
                  min={-180}
                  max={180}
                  step={1}
                  value={[settings.section2RotationZ]}
                  onValueChange={([value]) => setSettings({ ...settings, section2RotationZ: value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tilts the model side to side (-180° to 180°)
                </p>
              </div>

              {/* Section 2 Orientation String */}
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <Label>Section 2 Model Orientation (X Y Z)</Label>
                <code className="text-sm font-mono block break-all">
                  {getSection2Orientation()}
                </code>
              </div>

              {/* Section 2 TranslateX */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="section2TranslateX">End Translate X (%)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.section2TranslateX}%
                  </span>
                </div>
                <Slider
                  id="section2TranslateX"
                  min={-100}
                  max={100}
                  step={1}
                  value={[settings.section2TranslateX]}
                  onValueChange={([value]) => setSettings({ ...settings, section2TranslateX: value })}
                />
                <p className="text-xs text-muted-foreground">
                  How far right the model drifts (as a % of container width) to sit alongside the section 2 content
                </p>
              </div>

              {/* Section 2 Scale */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="section2Scale">End Scale (CSS scale)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {settings.section2Scale.toFixed(2)}×
                  </span>
                </div>
                <Slider
                  id="section2Scale"
                  min={0.1}
                  max={2}
                  step={0.01}
                  value={[settings.section2Scale]}
                  onValueChange={([value]) => setSettings({ ...settings, section2Scale: value })}
                />
                <p className="text-xs text-muted-foreground">
                  The CSS scale the model shrinks to at the end of the scroll animation (0.1× to 2×)
                </p>
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

          {/* Section 2 Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Section 2 Live Preview</CardTitle>
              <CardDescription>
                Preview of the 3D model at its scroll-animation end state alongside the &quot;Revitalize&quot; section content — matches the actual website exactly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden bg-white/60 backdrop-blur-xl border-2 border-[#19b35c] shadow-[0_8px_30px_rgb(0,0,0,0.06),0_0_60px_rgba(25,179,92,0.3)]">
                <div className="grid grid-cols-2 gap-4 min-h-[400px]">
                  {/* Model at section 2 end position */}
                  <div
                    className="relative"
                    style={{
                      transform: `scale(${settings.section2Scale})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <Model3DViewer
                      src={modelPath}
                      alt="3D Model Section 2 Preview"
                      autoRotate={false}
                      cameraControls={true}
                      orientation={getSection2Orientation()}
                      scale={getScale()}
                      style={{ width: '100%', height: '400px' }}
                    />
                  </div>

                  {/* Section 2 text content (matches actual website) */}
                  <div className="flex flex-col justify-center p-6 space-y-4">
                    <h2 className="text-2xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-[#19b35c] to-[#19b35c]/60 bg-clip-text text-transparent">Revitalize</span>
                      <span className="block text-gray-900">Existing Infrastructure.</span>
                    </h2>
                    <p className="text-sm text-gray-600">
                      Don&apos;t replace your poles. Upgrade them. Auralis attaches to any NEMA or wired setup in minutes.
                    </p>
                    <div className="flex gap-4">
                      {[{ value: '5 min', label: 'Install Time' }, { value: 'Zero', label: 'Rewiring' }, { value: 'IP66', label: 'Weather Rated' }].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-xl font-bold text-[#19b35c]">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
              <strong>Model Scale:</strong> Use the Scale X, Y, Z sliders to resize the model independently on each axis.
            </p>
            <div className="space-y-1 pl-4">
              <p>• <strong>Scale X (Width):</strong> Stretches or compresses the model horizontally</p>
              <p>• <strong>Scale Y (Height):</strong> Stretches or compresses the model vertically</p>
              <p>• <strong>Scale Z (Depth):</strong> Stretches or compresses the model in depth</p>
            </div>
            <p className="pt-2 border-t border-border">
              <strong>Camera Controls:</strong> Use your mouse/trackpad in the preview to zoom (scroll), drag (left-click), and move the camera view.
            </p>
            <p className="pt-2 border-t border-border">
              <strong>Section 2 Scroll Animation Target:</strong> These values control where the 3D model ends up as the user scrolls from Section 1 (Hero) into Section 2 (Revitalize). Use the X/Y/Z rotation sliders (same as Section 1) to set the model&apos;s orientation at the end of the scroll. Adjust the sliders, check the Section 2 Live Preview, then Save.
            </p>
            <div className="space-y-1 pl-4">
              <p>• <strong>Rotation X/Y/Z:</strong> Model orientation (via model-viewer) at the Section 2 end state — same axes as Section 1</p>
              <p>• <strong>End Translate X:</strong> How far right (%) the model drifts to sit alongside Section 2 content</p>
              <p>• <strong>End Scale:</strong> How small the model shrinks to at the end of the scroll</p>
            </div>
            <p className="pt-2 border-t border-border">
              The preview shows the model alongside the actual website text. Position the model using rotation controls and camera drag/zoom. After saving, the settings will be applied to the main product page at <code className="bg-muted px-1 rounded">/products/{productSlug}</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
