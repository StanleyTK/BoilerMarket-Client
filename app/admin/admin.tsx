import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState, useMemo } from 'react';
import {
  getActiveListings,
  getConncetedUsers,
  getHiddenListings,
  getSoldListings,
  isAdmin,
  banUser
} from '~/service/admin-service';
import { getReports, deleteReport } from '~/service/report-service';

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

const AdminDashboard: React.FC = () => {
  const [currentUsersOnline, setCurrentUsersOnline] = useState<number>(0);
  const [activeListings, setActiveListings] = useState<number>(0);
  const [soldListings, setSoldListings] = useState<number>(0);
  const [hiddenListings, setHiddenListings] = useState<number>(0);
  const [reports, setReports] = useState<Report[]>([]);
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
        const [online, active, sold, hidden, allReports] = await Promise.all([
          getConncetedUsers(token),
          getActiveListings(token),
          getSoldListings(token),
          getHiddenListings(token),
          getReports(token)
        ]);
        setCurrentUsersOnline(online);
        setActiveListings(active);
        setSoldListings(sold);
        setHiddenListings(hidden);
        setReports(allReports);
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
                <button
                  onClick={() => handleDelete(r.id)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: '#d32f2f',
                    color: '#fff',
                    marginRight: 8
                  }}
                >
                  Delete Report
                </button>
                <button
                  onClick={() => handleBan(r.reported_uid)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    backgroundColor: '#1976d2',
                    color: '#fff'
                  }}
                >
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
  <div
    style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 20,
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flex: 1,
      backgroundColor: '#fff',
      color: '#333'
    }}
  >
    <h2 style={{ margin: 0, marginBottom: 8 }}>{title}</h2>
    <p style={{ margin: 0, fontSize: 24 }}>{value}</p>
  </div>
);

export default AdminDashboard;
