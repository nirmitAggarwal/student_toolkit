import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api/axiosInstance';

function GitHubCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      toast.error('GitHub authentication failed');
      navigate('/login');
      return;
    }

    if (!code) {
      navigate('/login');
      return;
    }

    const authenticateWithGithub = async () => {
      try {
        const response = await api.post('/auth/github/callback', { code });
        const { user, token } = response.data;
        setUser(user, token);
        toast.success(`Welcome, ${user.name}!`);
        navigate('/dashboard');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'GitHub authentication failed');
        navigate('/login');
      }
    };

    authenticateWithGithub();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-foreground">
      <div className="text-center animate-fade-in-up">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-white mx-auto"></div>
        <p className="mt-4 text-white text-lg font-serif">Authenticating with GitHub...</p>
      </div>
    </div>
  );
}

export default GitHubCallbackPage;
