import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | undefined>(undefined);

  const [filePerc, setFilePerc] = useState(0);

  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState<{ avatar?: string }>({});

  console.log(file);
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData);

  const handleFileUpload = useCallback(
    (file: File) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (error) => {
          console.log(error);
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          });
        }
      );
    },
    [formData, setFilePerc, setFileUploadError]
  );

  useEffect(() => {

    if (file) {
      handleFileUpload(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  const openFilePicker = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(event) => {
            if (event.target.files) {
              setFile(event.target.files[0]);
            }
          }}
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
        />
        <img
          onClick={openFilePicker}
          src={formData.avatar || currentUser?.avatar}
          alt="Profile"
          className="rounded-full h-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
