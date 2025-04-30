import React, { useState } from 'react';
import './appeal.css';
import { useTheme } from '~/components/ThemeContext';
import { useBannedUser } from '~/components/MainLayout';
import { sendAppeal } from '~/service/user-service';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const AppealPage: React.FC = () => {
    const [appealMessage, setAppealMessage] = useState('');
    const { theme } = useTheme();
    const { banAppeal, setBanAppeal } = useBannedUser();
    const auth = getAuth();
    const [user] = useAuthState(auth);

    const handleSubmit = async () => {
        if (appealMessage.trim() != '' && user) {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("User not authenticated");
            }
            const idToken = await currentUser.getIdToken();
            const success = await sendAppeal(idToken, user.uid, appealMessage)
            if (success) {
                setBanAppeal(true);
            }
        }
        setAppealMessage('');
    };

    return (
        <div className={`${theme === "dark" ? "dark-appeal-container" : "light-appeal-container"} min-h-screen`}>
            <h1 className={`${theme === "dark" ? "dark-appeal-title" : "light-appeal-title"}`}>Appeal Your Ban</h1>
            {banAppeal ? (
                <p className={`${theme === "dark" ? "dark-appeal-text" : "light-appeal-text"}`}>
                    Appeal pending review
                </p>
            ) : (
                <>
                    <textarea
                        className={`${theme === "dark" ? "dark-appeal-textbox" : "light-appeal-textbox"}`}
                        value={appealMessage}
                        onChange={(e) => setAppealMessage(e.target.value)}
                        placeholder="Type your appeal message here..."
                    />
                    <button className={`${theme === "dark" ? "dark-appeal-button" : "light-appeal-button"}`} onClick={handleSubmit}>
                        Submit Appeal
                    </button>
                </>
            )}
        </div>
    );
};

export default AppealPage;