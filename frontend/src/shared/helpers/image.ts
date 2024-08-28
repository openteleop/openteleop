export const cropImage = async (
  blobUrl: string,
  cropBounds: { left: number; top: number; width: number; height: number },
): Promise<string> => {
  // Create an Image element
  const img = new Image();
  img.src = blobUrl;

  // Ensure the image is loaded
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2d context from canvas");
    return "";
  }

  // Calculate the crop region in pixels
  const cropX = cropBounds.left * img.width;
  const cropY = cropBounds.top * img.height;
  const cropWidth = cropBounds.width * img.width;
  const cropHeight = cropBounds.height * img.height;

  // Set the canvas size to the size of the cropping area
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // Draw the cropped image on the canvas
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  // Convert the canvas to a Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const newBlobUrl = URL.createObjectURL(blob);
        resolve(newBlobUrl);
      } else {
        reject("Failed to create blob from canvas");
      }
    }, "image/png");
  });
};

export const blobToBase64Url = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      // The result attribute contains the data as a base64-encoded string
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
