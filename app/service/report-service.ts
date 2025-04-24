export async function createReport(
  idToken: string,
  userUid: string,
  reportedUserUid: string,
  title: string,
  description: string,
) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/report/create/`, {
    method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
    body: JSON.stringify({ user:userUid, reported_user:reportedUserUid, title:title, description:description }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to create report");
  }

  return response.json();
}

export async function getReports(idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/report/get/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reports");
  }

  return response.json();
}
export async function deleteReport(idToken: string, reportId: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/report/delete/${reportId}/`, {
    method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to delete report");
  }

  return response.json();
}

export async function getAboutReports(uid: string, idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/report/about/${uid}/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reports");
  }

  return response.json();
}

export async function getByReports(uid: string, idToken: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/report/by/${uid}/`, {
    method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
      },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Failed to fetch reports");
  }

  return response.json();
}