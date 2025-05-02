import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState, useMemo, type ReactNode } from 'react';
import {
  getActiveListings,
  getConnectedUsers,
  getHiddenListings,
  getSoldListings,
  isAdmin,
} from '~/service/admin-service';
import { getReports, deleteReport } from '~/service/report-service';
import { banUser, fetchAllBannedUsers, resolveAppeal, unbanUser } from '~/service/user-service';

export interface Report {
  id: number;
  title: string;
  description: string;
  user_displayName: string;
  reported_displayName: string;
  uid: string;
  reported_uid: string;
  listing?: { id: number } | null;
  dateReported: string;
}

export interface BannedUser {
  username: ReactNode;
  uid: string;
  displayName: string;
  appeal: string;
  banAppeal: boolean;
}

const AdminDashboard: React.FC = () => {
  const [currentUsersOnline, setCurrentUsersOnline] = useState<number>(0);
  const [activeListings, setActiveListings] = useState<number>(0);
  const [soldListings, setSoldListings] = useState<number>(0);
  const [hiddenListings, setHiddenListings] = useState<number>(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [selectedReported, setSelectedReported] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(getApp()), user => setAuthUser(user));
    return unsub;
  }, []);

  useEffect(() => {
    if (!authUser) {
      setUserIsAdmin(false);
      return;
    }
    authUser.getIdToken()
      .then((token: string) => isAdmin(token))
      .then(setUserIsAdmin)
      .catch(() => setUserIsAdmin(false));
  }, [authUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userIsAdmin) return;
      setLoading(true);
      try {
        const token = await authUser.getIdToken();
        const [online, active, sold, hidden, allReports, allBannedUsers] = await Promise.all([
          getConnectedUsers(token),
          getActiveListings(token),
          getSoldListings(token),
          getHiddenListings(token),
          getReports(token),
          fetchAllBannedUsers(token)
        ]);

        const updatedBannedUsers = allBannedUsers.map((user: any) => ({
          ...user,
          banAppeal: user.appeal && user.appeal.trim() !== ""
        }));

        setCurrentUsersOnline(online);
        setActiveListings(active);
        setSoldListings(sold);
        setHiddenListings(hidden);
        setReports(allReports);
        setBannedUsers(updatedBannedUsers);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userIsAdmin, authUser]);

  const grouped = useMemo(() => {
    const map: Record<string, Report[]> = {};
    reports.forEach(r => {
      const key = r.reported_displayName;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return Object.entries(map)
      .map(([name, reps]) => ({ name, reps }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reports]);

  const handleDelete = async (reportId: number) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();
    await deleteReport(token, String(reportId));
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleBan = async (reportedUid: string) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();
    try {
      await banUser(token, reportedUid);
      setReports(prev => prev.filter(r => r.reported_uid !== reportedUid));
      setSelectedReported(null);
      alert('User banned successfully');
    } catch (e: any) {
      console.error(e);
      alert(`Ban failed: ${e.message}`);
    }
  };

  const handleUnban = async (reportedUid: string) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();
    try {
      await unbanUser(token, reportedUid);
      // Update state to remove the unbanned user
      setBannedUsers(prev => prev.filter(user => user.uid !== reportedUid));
      alert('User unbanned successfully');
    } catch (e: any) {
      console.error(e);
      alert(`Unban failed: ${e.message}`);
    }
  };
  

  const handleResolveAppeal = async (uid: string) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();
    try {
      await resolveAppeal(token, uid);
      setBannedUsers(prev => prev.map(user => user.uid === uid ? { ...user, appeal: "" } : user));
      alert('Appeal resolved successfully');
    } catch (e: any) {
      console.error(e);
      alert(`Failed to resolve appeal: ${e.message}`);
    }
  };

  if (!userIsAdmin) return <div>You do not have permission to view this page.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <div style={{ width: 220, borderRight: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
        <h3 style={{ margin: '0 0 10px', color: '#333' }}>Reported Users</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {grouped.map(g => (
            <li
              key={g.name}
              style={{
                cursor: 'pointer',
                margin: '6px 0',
                padding: '6px 8px',
                borderRadius: 4,
                backgroundColor: selectedReported === g.name ? '#e0e0e0' : 'transparent',
                color: '#333'
              }}
              onClick={() => setSelectedReported(g.name)}
            >
              {g.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, padding: 24, fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
          <StatCard title="Users Online" value={currentUsersOnline} />
          <StatCard title="Listings Up" value={activeListings} />
          <StatCard title="Listings Sold" value={soldListings} />
          <StatCard title="Listings Hidden" value={hiddenListings} />
        </div>

        {/* Banned Users Section */}
        <div style={{ marginBottom: 40 }}>
          <h2>Banned Users</h2>
          {bannedUsers.length === 0 ? (
            <p>No banned users.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bannedUsers.map(user => (
                <li
                  key={user.uid}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <p>ID: {user.uid}</p>
                  <p>Username: {user.username}</p>
                  {user.appeal && user.appeal !== "" && (
                    <p style={{ marginTop: 6, color: '#666' }}><em>Appeal:</em> {user.appeal}</p>
                  )}
                  {(!user.appeal || user.appeal === "") && (
                    <p style={{ marginTop: 6, color: '#666' }}><em>No appeal submitted.</em></p>
                  )}
                  {user.banAppeal && (
                    <div>
                      <button
                        onClick={() => handleResolveAppeal(user.uid)}
                        style={{ marginRight: 8, padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Resolve Appeal
                      </button>
                      <button
                        onClick={() => handleUnban(user.uid)}
                        style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Unban User
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Report details */}
        {selectedReported && (
          <div
            style={{
              position: 'fixed',
              top: 60,
              left: 260,
              right: 60,
              bottom: 60,
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: 24,
              overflowY: 'auto',
              zIndex: 1000
            }}
          >
            <button
              onClick={() => setSelectedReported(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
            <h2 style={{ marginBottom: 16 }}>Reports against {selectedReported}</h2>
            {grouped.find(g => g.name === selectedReported)?.reps.map(r => (
              <div
                key={r.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  padding: 12,
                  marginBottom: 16,
                  backgroundColor: '#fafafa'
                }}
              >
                <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{r.title}</p>
                <p style={{ marginBottom: 8 }}>{r.description}</p>
                <p style={{ marginBottom: 8 }}>User: {r.user_displayName} – {r.uid}</p>
                <p style={{ marginBottom: 8 }}>Reported: {r.reported_displayName} – {r.reported_uid}</p>
                <p style={{ marginBottom: 0 }}>Date Reported: {r.dateReported}</p>
                {r.listing && (
                  <p style={{ marginTop: 8 }}>Related Listing ID: {r.listing.id}</p>
                )}
                <button onClick={() => handleDelete(r.id)} style={{ marginRight: 8, marginTop: 8, padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Resolve Report
                </button>
                <button onClick={() => handleBan(r.reported_uid)} style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  Ban User
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div style={{ flex: 1, padding: 20, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3 style={{ marginBottom: 10 }}>{title}</h3>
    <div style={{ fontSize: '2rem' }}>{value}</div>
  </div>
);

export default AdminDashboard;
