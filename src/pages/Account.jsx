import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import { getUserProfile, updateUserProfile, changePassword } from '../service/userApi';
import Button from "../components/Button";
import InputField from "../components/InputField";
import DialogConfirm from "../components/DialogConfirm";
import { useToast } from "../context/ToastContext";
import { useForm } from 'react-hook-form';

const Account = () => {
  const { setHeading } = usePage();
  useEffect(() => {
    setHeading("Account");
  }, []);

  const [profile, setProfile] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    getValues: getPasswordValues,
    setError: setErrorPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const response = await getUserProfile();
        setProfile(response.data);
        setValue('name', response.data.name);
      } catch (err) {
        showToast("error", err.response?.data?.message || 'Failed to fetch profile data');
      }
    };

    fetchUserData();
  }, []);

  const { showToast } = useToast();

  const [showDialogConfirmChangeName, setShowDialogConfirmChangeName] = useState(false);
  const [showDialogConfirmChangePassword, setShowDialogConfirmChangePassword] = useState(false);

  const [showNameActions, setShowNameActions] = useState(false);
  const [showPasswordActions, setShowPasswordActions] = useState(false);

  useEffect(() => {
    watch((value) => {
      if (profile && profile.name !== value.name?.trim()) {
        setShowNameActions(true);
      } else {
        setShowNameActions(false);
      }
    });
  }, [profile, watch])

  const handleUpdateProfile = async () => {
    try {
      // Update user name
      const response = await updateUserProfile({ name: getValues('name') });
      setProfile(response.data);

      setShowDialogConfirmChangeName(false);
      setShowNameActions(false);

      showToast("success", 'Profile updated successfully');
    } catch (err) {
      showToast("error", err.message || 'Failed to update profile');
    }
  }

  const validateChangePassword = () => {
    if (getPasswordValues('newPassword') !== getPasswordValues('confirmPassword')) {
      setErrorPassword('newPassword', { message: "Passwords don't match" });
      setErrorPassword('confirmPassword', { message: "Passwords don't match" });

      return false;
    }

    setShowDialogConfirmChangePassword(true);
    return true;
  }

  const handleChangePassword = async () => {
    console.log(getPasswordValues('currentPassword'), getPasswordValues('newPassword'));
    try {
      await changePassword({ 
        old_password: getPasswordValues('currentPassword'),
        password: getPasswordValues('newPassword'),
      });

      setShowDialogConfirmChangePassword(false);
      setShowPasswordActions(false);
      resetPassword();

      showToast("success", 'Password changed successfully');
    } catch (err) {
      showToast("error", err.message || 'Failed to change password');
    }
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
            <form onSubmit={handleSubmit(() => setShowDialogConfirmChangeName(true))} className="flex gap-2">
              <InputField
                type="text"
                className="w-[400px]"
                {...register('name', { 
                  required: 'Name is required' 
                })}
                placeholder="Enter your name"                // onChange={(e) => {console.log(e.target.value); setNewName(e.target.value)}}
                error={errors.name?.message}
              />
              {/* If value change, show buttons */}
              {showNameActions &&
                <div className="flex gap-2">
                  <Button
                    className="w-24"
                    variant="secondary"
                    onClick={() => {
                      reset({ name: profile?.name });
                      setShowNameActions(false);
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
              }
            </form>
          </div>
        </div>

        {/* Password */}
        {!profile?.googleId &&
          <div className="border-[1.5px] rounded-md border-background-neutral p-4 space-y-2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Password</h2>
              {showPasswordActions ?
              <form className="flex flex-col gap-2" onSubmit={handleSubmitPassword(validateChangePassword)}>
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="Enter current password"
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  error={errorsPassword.currentPassword?.message}
                />
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="Enter new password"
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters long' }
                  })}
                  error={errorsPassword.newPassword?.message}
                />
                <InputField
                  className="w-[400px]"
                  type="password"
                  placeholder="Enter confirm new password"
                  {...registerPassword('confirmPassword', { required: 'Confirm password is required' })}
                  error={errorsPassword.confirmPassword?.message}
                />
                <div className="flex gap-2">
                  <Button
                    className="w-24"
                    variant="secondary"
                    onClick={() => {
                      setShowPasswordActions(false)
                      resetPassword();
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
                onClick={() => setShowPasswordActions(true)}
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

