import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import api from '../services/api/axiosInstance';

function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    rollNumber: user?.rollNumber || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/user/profile', formData);
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser, user?.token);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to update profile';
      
      // If session is invalid, prompt user to log in again
      if (error?.response?.status === 401 || errorMsg.includes('log in again')) {
        logout();
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage your profile and preferences</p>
      </div>

      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:bg-slate-800 dark:border-slate-700 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none opacity-50 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">College</label>
            <input
              type="text"
              name="college"
              placeholder="e.g., MSIT"
              value={formData.college}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Branch</label>
            <input
              type="text"
              name="branch"
              placeholder="e.g., CSE"
              value={formData.branch}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:border-primary"
            >
              <option value="">Select semester</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="e.g., 2023001"
              value={formData.rollNumber}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full rounded-full bg-primary hover:bg-secondary disabled:opacity-50 px-6 py-3 font-semibold text-white transition"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </section>
  );
}

export default SettingsPage;
