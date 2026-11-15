const API_BASE = '/api/v1'

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error(`Health check failed with HTTP ${res.status}`)
  return res.json()
}

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`)
  if (!res.ok) throw new Error(`Failed to load courses with HTTP ${res.status}`)
  return res.json()
}

export async function fetchCourseDetail(courseId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}`)
  if (!res.ok) throw new Error(`Failed to load course details with HTTP ${res.status}`)
  return res.json()
}

export async function fetchLessonDetail(lessonId) {
  const res = await fetch(`${API_BASE}/lessons/${lessonId}`)
  if (!res.ok) throw new Error(`Failed to load lesson with HTTP ${res.status}`)
  return res.json()
}

export async function fetchOfflinePack(lessonId) {
  const res = await fetch(`${API_BASE}/lessons/${lessonId}/offline-pack`)
  if (!res.ok) throw new Error(`Failed to load offline pack with HTTP ${res.status}`)
  return res.json()
}

export async function saveLessonProgress(lessonId, progressData) {
  const res = await fetch(`${API_BASE}/lessons/${lessonId}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progressData),
  })
  if (!res.ok) throw new Error(`Failed to sync progress with HTTP ${res.status}`)
  return res.json()
}

export async function fetchJobs() {
  const res = await fetch(`${API_BASE}/jobs`)
  if (!res.ok) throw new Error(`Failed to load jobs with HTTP ${res.status}`)
  return res.json()
}

export async function verifyCertificate(code) {
  const res = await fetch(`${API_BASE}/certificates/verify/${encodeURIComponent(code)}`)
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Certificate code "${code}" could not be verified in the registry.`)
    }
    throw new Error(`Verification service returned HTTP ${res.status}`)
  }
  return res.json()
}

export async function fetchPreferences() {
  const res = await fetch(`${API_BASE}/preferences`)
  if (!res.ok) throw new Error(`Failed to load preferences with HTTP ${res.status}`)
  return res.json()
}

export async function savePreferences(preferences) {
  const res = await fetch(`${API_BASE}/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  })
  if (!res.ok) throw new Error(`Failed to save preferences with HTTP ${res.status}`)
  return res.json()
}

export async function fetchSavannaStatus() {
  const res = await fetch(`${API_BASE}/integrations/savanna/status`)
  if (!res.ok) throw new Error(`Failed to load Savanna status with HTTP ${res.status}`)
  return res.json()
}
