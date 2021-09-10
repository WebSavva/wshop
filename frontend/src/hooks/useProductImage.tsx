import {useState,  useCallback} from 'react';
import { IFormFields } from '../types/FormPropsInterface';
import thumbnailSrc  from './../resources/default-image.jpg'

const useProductImage = () => {
    const [urlImage, setUrlImage] = useState<string>(thumbnailSrc);
    const [loadError, setLoadError] = useState<string | null>(null);

    const onLoadErrorHandler = () => {
        setUrlImage(thumbnailSrc);
        setLoadError('Invalid resource link is provided');
    };

    const onChangeCallback = useCallback((newFormData:IFormFields) => {
        const newUrlImageState = newFormData['image'];
        let delayedImageDisplay:NodeJS.Timeout;
        if (newUrlImageState.isValid) {
            setLoadError(null);
            delayedImageDisplay = setTimeout(() => setUrlImage(String(newUrlImageState.value)), 1e3);
        }

        return () => clearTimeout(delayedImageDisplay);
    }, []);
    
    return {
        onLoadErrorHandler,
        onChangeCallback,
        loadError,
        urlImage
    };
}

export default useProductImage;