# 3D Model Files

This directory contains the 3D model files for the Auralis product page.

## Required Files

Please place your 3D model files (in GLB or GLTF format) in this directory:

1. **auralis-desktop.glb** - The 3D model for desktop view (fixed background)
   - Recommended: Optimized for desktop viewing
   - Should work well with auto-rotation enabled
   - No camera controls needed (users can't interact)

2. **auralis-mobile.glb** - The 3D model for mobile view
   - Recommended: Optimized for mobile devices (lower polygon count)
   - Camera controls enabled for user interaction
   - Touch-friendly

## Model Format

- **Preferred Format**: GLB (Binary GLTF) - More efficient, single file
- **Alternative**: GLTF with textures - Separate files but more editable

## Optimization Tips

1. Keep polygon count reasonable (under 100k triangles for mobile, under 500k for desktop)
2. Compress textures to reasonable sizes (1024x1024 or 2048x2048 max)
3. Use Draco compression for smaller file sizes
4. Test on mobile devices to ensure smooth performance

## Converting from Spline

If you have Spline models, you'll need to:
1. Export from Spline (if possible)
2. Or recreate the model in Blender/other 3D software
3. Export as GLB format

## Testing

The model-viewer component supports:
- Auto-rotation
- Camera controls (pan, zoom, rotate)
- Touch gestures on mobile
- Lazy loading
- Loading states

## Current Status

⚠️ **ACTION REQUIRED**: Please add your 3D model files to this directory.

The page currently has placeholder paths configured:
- Desktop: `/models/auralis-desktop.glb`
- Mobile: `/models/auralis-mobile.glb`

Once you add the files, they will automatically load on the Auralis product page.
