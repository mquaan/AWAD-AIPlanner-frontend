import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import { getUserProfile, updateUserProfile, changePassword } from '../service/userApi';
import Button from "../components/Button";
import InputField from "../components/InputField";
import DialogConfirm from "../components/DialogConfirm";
import { useToast } from "../context/ToastContext";

const Account = () => {
  const { setHeading } = usePage();
  useEffect(() => {
    setHeading("Account");
  }, []);

  const [profile, setProfile] = useState(null);

  const { showToast } = useToast();

  const [newName, setNewName] = useState("");
  const [isNameChange, setIsNameChange] = useState(false);

  useEffect(() => {
    if (profile && profile.name !== newName.trim()) {
      setIsNameChange(true);
    } else {
      setIsNameChange(false);
    }
  }, [newName]);

  const [errorMessages, setErrorMessages] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUserData = async () => {
    try {
      // Fetch user data from the API
      const response = await getUserProfile();
      setProfile(response.data);
      setNewName(response.data.name);
    } catch (err) {
      showToast("error", err.message || 'Failed to fetch profile data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [showDialogConfirmChangeName, setShowDialogConfirmChangeName] = useState(false);
  const [showDialogConfirmChangePassword, setShowDialogConfirmChangePassword] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      // Update user name
      const response = await updateUserProfile({ name: newName });
      setProfile(response.data);
      setShowDialogConfirmChangeName(false);
      setIsNameChange(false);

      showToast("success", 'Profile updated successfully');
    } catch (err) {
      showToast("error", err.message || 'Failed to update profile');
    }
  }

  const validateChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessages({
        ...errorMessages,
        confirmPassword: "Passwords don't match",
      });
      return false;
    }

    setShowDialogConfirmChangePassword(true);
    return true;
  }

  const handleChangePassword = async () => {
    try {
      await changePassword({ 
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      setShowDialogConfirmChangePassword(false);
      setIsPasswordChange(false);
      clearPasswordFields();

      showToast("success", 'Password changed successfully');
    } catch (err) {
      showToast("error", err.message || 'Failed to change password');
    }
  }

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setErrorMessages({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  const handleChangePhoto = async (e) => {
    e.preventDefault();
    
    var formData = new FormData();
    formData.append('image', e.target.files[0]);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Basic information */}
        <div className="border-[1.5px] rounded-md border-background-neutral p-4 space-y-4">
          {/* Photo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Photo</h2>
            <div className="flex items-center gap-4">
              <img 
                src={profile?.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full bg-background-neutral"
              />
              <div>
                <input id="update-profile-picture" type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleChangePhoto} />
                <Button
                  className="w-fit"
                  onClick={() => document.getElementById('update-profile-picture').click()}
                >
                  Change photo
                </Button>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Email</h2>
            <InputField
                type="text"
                className="w-[400px]"
                defaultValue={profile?.email}
                disabled
              />
          </div>

          {/* Name */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Name</h2>
            <div className="flex gap-2">
              <InputField
                type="text"
                className="w-[400px]"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {/* If value change, show buttons */}
              {isNameChange &&
                <div className="flex gap-2">
                  <Button
                    className="w-24"
                    variant="secondary"
                    onClick={() => setNewName(profile?.name)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-24"
                    onClick={() => setShowDialogConfirmChangeName(true)}
                  >
                    Save
                  </Button>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Password */}
        {!profile?.googleId &&
          <div className="border-[1.5px] rounded-md border-background-neutral p-4 space-y-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Password</h2>
              {isPasswordChange ?
              <form className="flex flex-col gap-2" onSubmit={validateChangePassword}>
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrorMessages({
                      ...errorMessages,
                      confirmPassword: "",
                    });
                  }}
                  required
                  error={errorMessages.confirmPassword}
                />
                <div className="flex gap-2">
                  <Button
                    className="w-24"
                    variant="secondary"
                    onClick={() => {
                      setIsPasswordChange(false)
                      clearPasswordFields()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-24"
                  >
                    Save
                  </Button>
                </div>
              </form>
              :
              <Button
                className="w-fit"
                onClick={() => setIsPasswordChange(true)}
              >
                Change password
              </Button>
              }
            </div>
          </div>
        }
      </div>

      <DialogConfirm 
        open={showDialogConfirmChangeName}
        onClose={() => setShowDialogConfirmChangeName(false)}
        onConfirm={handleUpdateProfile}
        title="Confirm"
        content="Are you sure you want to change your name?"
      />

      <DialogConfirm 
        open={showDialogConfirmChangePassword}
        onClose={() => setShowDialogConfirmChangePassword(false)}
        onConfirm={handleChangePassword}
        title="Confirm"
        content="Are you sure you want to change your password?"
      />
    </>
  );
};

export default Account;

