import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import { getUserProfile, updateUserProfile, changePassword } from '../service/userApi';
import { useAuth } from "../context/AuthContext";

const Account = () => {
  const { setHeading } = usePage();
  useEffect(() => {
    setHeading("Account");
  }, []);

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState("");

  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUserData = async () => {
    try {
      // Fetch user data from the API
      const response = await getUserProfile(user.id);
      setProfile(response.data);

      setNewName(response.data.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Update user name
      const response = await updateUserProfile({ name: newName });
      setProfile(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      
      return;
    }

    try {
      await changePassword({ 
        currentPassword: currentPassword,
        newPassword: newPassword
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <>
      {error && <p>{error}</p>}
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
              <button className="px-4 py-2 bg-primary border-none rounded-md cursor-pointer shadow-md transition-colors duration-300 text-base
                              font-semibold text-white hover:bg-button-hover">Change photo</button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Email</h2>
            <p>{profile?.email}</p>
          </div>

          {/* Name */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Name</h2>
            <div className="flex gap-2">
              <input
                type="text"
                className="h-8"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {/* If value change, show buttons */}
              {profile && profile.name !== newName.trim() &&
                <div className="flex gap-2">
                  <button
                    className="h-8 px-4 py-2 bg-background-neutral border-2 border-background-neutral rounded-md cursor-pointer shadow-md transition-colors duration-300 text-base
                                  font-semibold text-text-primary hover:bg-background-neutral"
                    onClick={() => setNewName(profile?.name)}
                  >Cancel
                  </button>
                  <button
                    className="h-8 px-4 py-2 bg-primary border-none rounded-md cursor-pointer shadow-md transition-colors duration-300 text-base
                                  font-semibold text-white hover:bg-button-hover"
                    onClick={handleUpdateProfile}
                  >Save
                  </button>
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
              <form className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Current password"
                  className="h-8"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="h-8"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="h-8"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button
                    className="h-8 px-4 py-2 bg-background-neutral border-2 border-background-neutral rounded-md cursor-pointer shadow-md transition-colors duration-300 text-base
                                font-semibold text-text-primary hover:bg-background-neutral"
                    onClick={() => setIsPasswordChange(false)}
                  >Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-4 py-2 bg-primary border-none rounded-md cursor-pointer shadow-md transition-colors duration-300 text-base
                                font-semibold text-white hover:bg-button-hover"
                    onClick={handleChangePassword}
                  >Save
                  </button>
                </div>
              </form>
              :
              <button className="border-2" onClick={() => setIsPasswordChange(true)}>Change password</button>
              }
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default Account;
