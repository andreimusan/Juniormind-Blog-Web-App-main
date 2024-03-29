
export const validateFile = (file: File | undefined, setFileError: Function, removePreviewFile: Function) => {
  if (file !== undefined) {
    const fileType =  file.type.split("/")[1];
    const nameType =  file.name.split(".")[1];
    const acceptedFileFormats = /jpeg|jpg|png|gif|tiff/;
    const isCorrectMimeType = acceptedFileFormats.test(fileType.toLowerCase());
    const isCorrectExtName = acceptedFileFormats.test(nameType.toLowerCase());
    if (!isCorrectMimeType || !isCorrectExtName) {
      setFileError("Only images can be uploaded.");
      removePreviewFile();
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image size cannot be larger that 2MB.");
      removePreviewFile();
      return;
    }
  }
}