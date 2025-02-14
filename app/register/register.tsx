import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ServiceContainer } from '~/service/service-container';
import { registerUser } from '~/service/user-service';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const authService = useMemo(() => ServiceContainer.instance().authService, []);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authService
      .register(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('User registered:', user);
        const idToken = await user.getIdToken();
        try {
          await registerUser(user.uid, email, displayName, bio, idToken);
          // Redirect to the login page after successful registration
          navigate('/login');
        } catch (e) {
          // Optionally handle rollback if necessary.
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error registering user:', errorCode, errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          alert('Email already in use. Please try again with a different email.');
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <form onSubmit={handleSubmit} className="w-80 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
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
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          rows={3}
        />
        <button type="submit" className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
