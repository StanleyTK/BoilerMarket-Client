import React, { useState } from 'react';
import './appeal.css'; // Import the CSS file
import { useTheme } from '~/components/ThemeContext';

const AppealPage: React.FC = () => {
    const [appealMessage, setAppealMessage] = useState('');
    const { theme } = useTheme();

    const handleSubmit = () => {
        if (appealMessage.trim() === '') {
            alert('Please enter a message before submitting.');
            return;
        }
        // Handle the appeal submission logic here (e.g., send to API)
        alert('Your appeal has been submitted.');
        setAppealMessage(''); // Clear the text box after submission
    };

    return (
        <div className={`${theme === "dark" ? "dark-appeal-container" : "light-appeal-container"} min-h-screen`}>
            <h1 className={`${theme === "dark" ? "dark-appeal-title" : "light-appeal-title"}`}>Appeal Your Ban</h1>
            <textarea
                className={`${theme === "dark" ? "dark-appeal-textbox" : "light-appeal-textbox"}`}
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                placeholder="Type your appeal message here..."
            />
            <button className={`${theme === "dark" ? "dark-appeal-button" : "light-appeal-button"}`} onClick={handleSubmit}>
                Submit Appeal
            </button>
        </div>
    );
};

export default AppealPage;