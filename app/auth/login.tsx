import React, { useMemo, useState } from 'react';
import { ServiceContainer } from '~/service/service-container';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authService = useMemo(() => ServiceContainer.instance().authService, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const user = await authService.login(email, password);
            // TODO: redirect to another page
            console.log('token', await user.user.getIdToken());
        } catch (error) {
            alert('login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ color: '#333', textAlign: 'center' }}>Login</h2>
                <label style={{ color: '#333', marginTop: '10px', marginBottom: '10px', width: '100%', textAlign: 'center' }}>
                    <input
                        type="email"
                        placeholder='johndoe@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </label>
                <label style={{ color: '#333', marginBottom: '10px', width: '100%', textAlign: 'center' }}>
                    <input
                        type="password"
                        placeholder='********'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </label>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;