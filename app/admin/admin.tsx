import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getConncetedUsers, isAdmin } from '~/service/admin-service';

const AdminDashboard: React.FC = () => {
    const [currentUsersOnline, setCurrentUsersOnline] = useState(0);
    const [listingsUp, setListingsUp] = useState(0);
    const [listingsSold, setListingsSold] = useState(0);
    const [listingsHidden, setListingsHidden] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [authUser, setAuthUser] = useState<any>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(getAuth(getApp()), (user) =>
          setAuthUser(user)
        );
        return unsub;
    }, []);

    useEffect(() => {
        const checkAdminStatus = async () => {
          if (authUser) {
            try {
              const token = await authUser.getIdToken();
              const result = await isAdmin(token);
              setUserIsAdmin(result);
            } catch (error) {
              console.error("Error checking admin status", error);
              setUserIsAdmin(false);
            }
          } else {
            setUserIsAdmin(false);
          }
        };
    
        checkAdminStatus();
    }, [authUser]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userIsAdmin) {
                setLoading(false);
                return;
            }
            try {
                const token = await authUser?.getIdToken();
                setCurrentUsersOnline(await getConncetedUsers(token));
            } catch (error) {
                console.error('Error fetching data', error);
                setError('Failed to fetch data');
                setLoading(false);
                return;
            }
        };

        fetchData();
    }, [userIsAdmin, authUser]);

    if (!userIsAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={cardStyle}>
                    <h2>Current Users Online</h2>
                    <p>{currentUsersOnline}</p>
                </div>
                <div style={cardStyle}>
                    <h2>Listings Up</h2>
                    <p>{listingsUp}</p>
                </div>
                <div style={cardStyle}>
                    <h2>Listings Sold</h2>
                    <p>{listingsSold}</p>
                </div>
                <div style={cardStyle}>
                    <h2>Listings Hidden</h2>
                    <p>{listingsHidden}</p>
                </div>
            </div>
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flex: 1,
};

export default AdminDashboard;