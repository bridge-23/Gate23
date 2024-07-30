export const resizeAndGrayscaleImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const scaleFactor = 800 / img.width;
      canvas.width = 900;
      canvas.height = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // const data = imageData.data;
      // for (let i = 0; i < data.length; i += 4) {
      //   const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      //   data[i] = avg; // red
      //   data[i + 1] = avg; // green
      //   data[i + 2] = avg; // blue
      // }
      // ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name, { type: file.type });
          resolve(newFile);
        } else {
          console.error("Image processing failed.");
        }
      }, file.type);
    };
  });
};
