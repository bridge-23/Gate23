import Tesseract from 'tesseract.js';
import { resizeAndGrayscaleImage } from './resizeAndGrayscaleImage';

export const recognizeText = async (file) => {
    const worker = await Tesseract.createWorker('eng+chi_tra+rus');
    
    try {
        const processedImage = await resizeAndGrayscaleImage(file);
        const { data: { text } } = await worker.recognize(processedImage);
        return text;
    } catch (error) {
        return 'Error of bild recognize:' + error;
    } finally {
        await worker.terminate();
    }
};
