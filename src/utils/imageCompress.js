/**
 * VidyaVerse - High Performance Client-Side Image Optimizer for Gemini Vision
 * Resizes and compresses images (File, Blob, or base64 Data URL) to max 1024px @ 0.85 JPEG quality.
 * Reduces 10MB WhatsApp images and phone camera photos to ~100-150KB for sub-second AI vision inference.
 */
export function compressImageForVision(imageInput, maxDim = 1024, quality = 0.85) {
  return new Promise((resolve) => {
    if (!imageInput) return resolve(null);

    const processImg = (img) => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          return resolve(typeof imageInput === 'string' ? imageInput : null);
        }

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(typeof imageInput === 'string' ? imageInput : null);
        }

        // Smooth high quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('[ImageCompress] Fallback to raw input:', err.message);
        resolve(typeof imageInput === 'string' ? imageInput : null);
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => processImg(img);
    img.onerror = () => {
      console.warn('[ImageCompress] Image load error');
      resolve(typeof imageInput === 'string' ? imageInput : null);
    };

    if (typeof imageInput === 'string') {
      img.src = imageInput;
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(imageInput);
    } else {
      resolve(null);
    }
  });
}
