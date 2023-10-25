import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);

  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | undefined>(undefined);

  const [filePerc, setFilePerc] = useState(0);

  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState<{
    avatar?: string;
    username?: string;
    email?: string;
  }>({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch();

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        dispatch(updateUserFailure(error.message));
      } else {
        dispatch(updateUserFailure("An error occured."));
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          
        }
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      if (error instanceof Error) {
        dispatch(deleteUserFailure(error.message));
      } else {
        dispatch(deleteUserFailure("An error occured."));
      }
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout', {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {

          dispatch(signOutUserFailure(data.message));
          return;
        

      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signOutUserFailure(error.message));
      } else {
        dispatch(signOutUserFailure("An error occured."));
      }
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
          src={formData?.avatar || currentUser?.avatar}
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
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "User is updated successfully!" : ""}</p>
    </div>
  );
};

export default Profile;
