import { useCallback, useEffect, useState } from "react";
import { validateFile } from "./validateFile";
import { FileInput, PostFilePreview, RemoveFileBtn, UploadError } from "./styles/components.styles";
import { UserProfileContainer, UserProfilePicture } from "./userStyledComponents/userProfileStyling";


const ImageFileInput = (props: { file: any, setFile: Function, parent: string }) => {
  const [preview, setPreview] = useState("");
  const [value, setValue] = useState("");
  const [fileError, setFileError] = useState("");
  
  const removePreviewFile = useCallback(() => {
    setPreview("");
    props.setFile(undefined);
    setValue("");
  }, [props]);

  useEffect(() => {
    if (props.file === undefined) return;
    const objectUrl = URL.createObjectURL(props.file);
    validateFile(props.file, setFileError, removePreviewFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [props.file, removePreviewFile]);

  return (
    <div>
      <FileInput
        type="file"
        value={value}
        onChange={(e: any) => {
            setFileError("");
            props.setFile(e.target.files[0]);
            setValue(e.target.value);
          }
        }
        accept=".jpg, .jpeg, .png, .gif, .tiff"
      />
      {
        props.file !== undefined && props.parent === "post" && (
          <div>
            <PostFilePreview src={preview} />
            <RemoveFileBtn onClick={
                (e: any) => {
                  removePreviewFile();
                  e.target.value = null; 
                }
              }
            />
          </div>
        )
      }
      {
        props.file !== undefined && props.parent === "user" && (
          <div>
            <UserProfileContainer>
                <UserProfilePicture src={preview} alt={"profile"} />
            </UserProfileContainer>
            <RemoveFileBtn onClick={
                (e: any) => {
                  removePreviewFile();
                  e.target.value = null; 
                }
              }
            />
          </div>
        )
      }
      {fileError !== "" && <UploadError>{fileError}</UploadError>}
    </div>
  );
}

export default ImageFileInput;