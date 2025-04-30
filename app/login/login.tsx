import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ServiceContainer } from '~/service/service-container';
import { getBAndAStatus } from '~/service/user-service';
import { useBannedUser } from '~/components/MainLayout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authService = useMemo(() => ServiceContainer.instance().authService, []);
  const navigate = useNavigate();
  const { setBanAppeal, setUserBanned } = useBannedUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user = await authService.login(email, password);
      const idToken = await user.user.getIdToken();
      console.log('token', idToken);

      const status = await getBAndAStatus(idToken, user.user.uid);

      setUserBanned(status.banned);
      setBanAppeal(status.appealPending);

      if (status.banned) {
        navigate('/appeal')
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <form onSubmit={handleSubmit} className="w-80 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <input
          type="email"
          placeholder="johndoe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full mt-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
