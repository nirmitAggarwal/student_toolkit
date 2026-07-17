import { useNavigate } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api/axiosInstance';

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-foreground px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-white">Student Toolkit</h1>
          <p className="mt-2 text-white/70 text-sm">IEEE MSIT Engineering Dashboard</p>
        </div>

        <div className="mt-12 space-y-4">
          <button
            onClick={handleGithubLogin}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white/10 border border-white/20 px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:shadow-lg backdrop-blur-sm"
          >
            <FiGithub className="h-5 w-5" />
            Sign in with GitHub
          </button>

          <button
            onClick={async () => {
              try {
                const response = await api.post('/auth/mock-login');
                const { user, token } = response.data;
                setUser(user, token);
                toast.success(`Logged in as ${user.name} (Dev Mode)`);
                navigate('/dashboard');
              } catch (err) {
                toast.error('Mock login failed');
                console.error(err);
              }
            }}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-secondary hover:bg-secondary-hover px-6 py-3.5 font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Mock Login (Dev Mode)
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
