const DB_NAME = 'AccessLearnOfflineDB'
const DB_VERSION = 1
const STORE_LESSONS = 'offline_lessons'
const STORE_SYNC_QUEUE = 'progress_sync_queue'

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported on this browser'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_LESSONS)) {
        db.createObjectStore(STORE_LESSONS, { keyPath: 'lessonId' })
      }
      if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
        db.createObjectStore(STORE_SYNC_QUEUE, { autoIncrement: true, keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveOfflineLesson(lessonData, packageType = 'full') {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readwrite')
    const store = tx.objectStore(STORE_LESSONS)

    // Calculate approximate size
    const jsonStr = JSON.stringify(lessonData)
    const approximateBytes = new Blob([jsonStr]).size

    const record = {
      lessonId: lessonData.lesson_id || lessonData.id,
      title: lessonData.title,
      courseId: lessonData.course_id,
      contentHtml: lessonData.content_html,
      description: lessonData.description,
      packageType, // 'text_only' | 'audio_pack' | 'full'
      downloadedAt: new Date().toISOString(),
      fileSizeBytes: approximateBytes + (packageType === 'full' ? 3200000 : 450000),
      rawPack: lessonData,
    }

    const request = store.put(record)
    request.onsuccess = () => resolve(record)
    request.onerror = () => reject(request.error)
  })
}

export async function getOfflineLessons() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readonly')
    const store = tx.objectStore(STORE_LESSONS)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function getOfflineLesson(lessonId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readonly')
    const store = tx.objectStore(STORE_LESSONS)
    const request = store.get(lessonId)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteOfflineLesson(lessonId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_LESSONS, 'readwrite')
    const store = tx.objectStore(STORE_LESSONS)
    const request = store.delete(lessonId)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

export async function queueOfflineProgress(lessonId, progressData) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SYNC_QUEUE, 'readwrite')
    const store = tx.objectStore(STORE_SYNC_QUEUE)
    const record = {
      lessonId,
      progressData,
      queuedAt: new Date().toISOString(),
    }
    const request = store.add(record)
    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}
