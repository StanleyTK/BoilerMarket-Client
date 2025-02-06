import React, { useMemo, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ServiceContainer } from '~/service/service-container';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const authService = useMemo(() => ServiceContainer.instance().authService, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // register email and password with firebase

        authService.register(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('User registered:', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error registering user:', errorCode, errorMessage);
            });
        // send uid, username, and bio to backend
        console.log({ email, password, username, bio });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <form style={{ display: 'flex', flexDirection: 'column', width: '300px', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} onSubmit={handleSubmit}>
            <h2 style={{ color: 'black', textAlign: 'center' }}>Register</h2>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ color: '#333' }}>Email:</label>
                <input
                type="email"
                placeholder='johndoe@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ color: 'black' }}>Password:</label>
                <input
                type="password"
                placeholder='********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ color: 'black' }}>Username:</label>
                <input
                type="text"
                placeholder='johndoe'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ color: 'black' }}>Bio:</label>
                <textarea
                value={bio}
                placeholder='Tell us about yourself...'
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <button 
                type="submit" 
                style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> Register </button>
            </form>
        </div>
    );
};

export default Register;