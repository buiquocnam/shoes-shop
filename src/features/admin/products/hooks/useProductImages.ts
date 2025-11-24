import { useState, useCallback } from "react";

export const useProductImages = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleAddImages = useCallback((files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    handleAddImages,
    handleRemoveImage,
    resetImages,
  };
};

