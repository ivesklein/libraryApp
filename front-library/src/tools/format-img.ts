type ResizeOptions = {
  width: number;
  height: number;
};

// Resize and quantize image to 16 colors
export async function processImage(file: File, resizeOptions: ResizeOptions): Promise<HTMLCanvasElement> {
  // Create an image from the file
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Resize
      const canvas = document.createElement('canvas');
      canvas.width = resizeOptions.width;
      canvas.height = resizeOptions.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("2D context not available"));
        return;
      }
      
      // Draw image at specified size
      ctx.drawImage(img, 0, 0, resizeOptions.width, resizeOptions.height);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple color quantization to 16 colors (4 bits per channel)
      for (let i = 0; i < data.length; i += 4) {
        // Quantize each RGB channel to 4 levels (2^2)
        data[i] = Math.round(data[i] / 85) * 85;     // Red
        data[i + 1] = Math.round(data[i + 1] / 85) * 85; // Green
        data[i + 2] = Math.round(data[i + 2] / 85) * 85; // Blue
        // Alpha channel remains unchanged
      }
      
      // Put the processed data back
      ctx.putImageData(imageData, 0, 0);
      
      // Clean up
      URL.revokeObjectURL(imageUrl);
      
      resolve(canvas);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image"));
    };
    
    img.src = imageUrl;
  });
}