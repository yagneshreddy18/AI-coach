import { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Target, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authAPI } from '../../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // profile, goals, security

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || ''); // Read-only
  const [profileSaving, setProfileSaving] = useState(false);

  // Targets Form States
  const [dsaGoal, setDsaGoal] = useState(user?.settings?.dailyDsaGoal || 5);
  const [fsGoal, setFsGoal] = useState(user?.settings?.dailyFullstackGoal || 2);
  const [aptGoal, setAptGoal] = useState(user?.settings?.dailyAptitudeGoal || 20);
  const [projGoal, setProjGoal] = useState(user?.settings?.dailyProjectGoal || 3);
  const [goalsSaving, setGoalsSaving] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name is required', 'error');
      return;
    }
    try {
      setProfileSaving(true);
      const res = await authAPI.updateProfile({ name });
      updateUser(res.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveGoals = async (e) => {
    e.preventDefault();
    try {
      setGoalsSaving(true);
      const settings = {
        dailyDsaGoal: parseInt(dsaGoal, 10),
        dailyFullstackGoal: parseInt(fsGoal, 10),
        dailyAptitudeGoal: parseInt(aptGoal, 10),
        dailyProjectGoal: parseInt(projGoal, 10),
      };
      const res = await authAPI.updateSettings(settings);
      
      // Update global user object
      const updatedUser = { ...user, settings: res.data };
      updateUser(updatedUser);
      addToast('Default daily goals updated!', 'success');
    } catch (err) {
      addToast('Failed to update settings', 'error');
    } finally {
      setGoalsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Please enter password fields', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Confirm password does not match new password', 'error');
      return;
    }
    try {
      setPasswordSaving(true);
      await authAPI.changePassword({ currentPassword, newPassword });
      addToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
          <SettingsIcon className="text-dark-400 animate-spin-slow" /> Settings
        </h1>
        <p className="text-dark-400">Configure profile settings, defaults daily targets, and manage password security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Column Tabs */}
        <div className="glass-card p-4 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
            }`}
          >
            <User size={15} /> Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === 'goals'
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
            }`}
          >
            <Target size={15} /> Default Targets
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
              activeTab === 'security'
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
            }`}
          >
            <Shield size={15} /> Login & Security
          </button>
        </div>

        {/* Right Columns Forms */}
        <div className="glass-card p-6 md:col-span-3">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <h3 className="text-base font-bold mb-4">Edit Profile</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input-base opacity-50 cursor-not-allowed"
                />
                <p className="text-[10px] text-dark-500 mt-1">Contact system administrator to change registered email.</p>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={profileSaving} className="btn btn-primary px-6 py-2.5">
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'goals' && (
            <form onSubmit={handleSaveGoals} className="space-y-4 text-xs">
              <h3 className="text-base font-bold mb-4">Default Goals Settings</h3>
              <p className="text-dark-400 leading-relaxed mb-4 text-xs">
                Your new targets will define default goals for every future day. You can customize them per day at any time in the targets interface.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">DSA Problems Solved</label>
                  <input
                    type="number"
                    min="0"
                    value={dsaGoal}
                    onChange={(e) => setDsaGoal(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Stack Lessons Finished</label>
                  <input
                    type="number"
                    min="0"
                    value={fsGoal}
                    onChange={(e) => setFsGoal(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Aptitude Questions Solved</label>
                  <input
                    type="number"
                    min="0"
                    value={aptGoal}
                    onChange={(e) => setAptGoal(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project Tasks Checked</label>
                  <input
                    type="number"
                    min="0"
                    value={projGoal}
                    onChange={(e) => setProjGoal(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={goalsSaving} className="btn btn-primary px-6 py-2.5">
                  {goalsSaving ? 'Saving...' : 'Save Default Goals'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <h3 className="text-base font-bold mb-4">Change Password</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base"
                  required
                />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={passwordSaving} className="btn btn-primary px-6 py-2.5">
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
