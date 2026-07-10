import { useNavigate } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-white">Student Toolkit</h1>
          <p className="mt-2 text-white/80">Engineering student dashboard</p>
        </div>

        <div className="mt-12 space-y-4">
          <button
            onClick={handleGithubLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <FiGithub className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-white/60">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
