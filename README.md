# ACCESSBRIDGE / AccessLearn Ethiopia
## Digital Bridge Accessibility Hackathon 2026 — Track 2: Accessible Learning Media

> **"One lesson. Multiple ways to learn. No learner left behind."**

ACCESSBRIDGE (AccessLearn Ethiopia) is an inclusive digital learning media platform engineered to eliminate educational barriers for Deaf and hard-of-hearing learners, blind and low-vision learners, and students accessing educational content over constrained 2G/3G mobile networks across Ethiopia.

---

## 🌟 Core Track 2 Capabilities

### 1. AccessPlayer Accessible Multimedia Engine
- **Keyboard & Screen-Reader Accessible**: Documented keyboard navigation across all controls (`Space`/`K` for play/pause, `J`/`L` for seek, `Up`/`Down` for volume, `M` for mute, `F` for fullscreen, `<`/`>` for speed).
- **Variable Playback Speeds**: Custom speeds from `0.5x` to `2.0x`.
- **Responsive Viewport**: Maintains full readability and touch target sizing across desktop, tablet, and mobile devices, resilient up to 200% browser zoom.

### 2. Multilingual Closed Captions
- **Bilingual Tracks**: Authentic English and Amharic (Ethiopic script) caption streams.
- **Customizable Appearance**:
  - Font scaling: Small (14px), Medium (18px), Large (24px), Extra Large (30px).
  - High-contrast color palettes: White-on-Black, Yellow-on-Black, Cyan-on-Black, and Black-on-White.
  - Background opacity adjustment (50%, 75%, 100% solid).

### 3. Synchronized Interactive Transcript
- **Real-Time Highlighting**: Highlights active speech cue in real time as video plays.
- **Click-to-Seek**: Jump player playback to any spoken sentence instantly.
- **Integrated Search**: Search speech text with real-time match counts and previous/next navigation.
- **Web Speech Read-Aloud**: Text-to-speech audio reader for auditory learners.
- **Multi-Format Export**: Download transcript as TXT, WebVTT, or SRT.

### 4. Movable & Resizable Ethiopian Sign Language (EthSL) Window
- Synchronized picture-in-picture interpreter overlay window tracking lesson playback.
- **Keyboard-Accessible Repositioning**: Shift between 4 screen corners (`Bottom-Right`, `Bottom-Left`, `Top-Left`, `Top-Right`) without requiring mouse dragging.
- **Size Options**: Toggle between `Normal` (220px) and `Large` (320px) viewports.

### 5. Audio Descriptions & Language Switching
- Secondary narrated audio track describing visual demonstrations and diagrams.
- Audio language switching between English and Amharic without resetting playback position.

### 6. 3G Offline Learning Packs & IndexedDB Library
- **Offline Shell**: Progressive Web App (PWA) with Service Worker caching.
- **IndexedDB Storage**: Complete offline lesson packages stored locally in browser storage.
- **Storage Manager**: View downloaded lessons, file sizes, and storage usage, with one-click removal.
- **Low-Bandwidth Modes**: Download text-only, audio+text packs, or lightweight HTML packages for 2G/3G connections.

### 7. Accessible Learning Documents
- Semantic HTML lesson format with structured headings, alternative text for diagrams, and zoom-safe typography.

### 8. Accessible Career Gateway
- Curated employment opportunities with explicit accessibility accommodation badges (e.g., *Screen-reader friendly recruitment*, *EthSL interpreter provided*, *Deaf-led workplace*).
- **Audio Job Summaries**: Listen to spoken job descriptions via Web Speech API.

### 9. Verifiable Certificate Registry
- Unique cryptographic verification codes (e.g., `AL-2026-ETH-9821`).
- Public verification endpoint validating issuer, recipient, issue date, and course credentials without exposing private learner information.

### 10. ALX Savanna LMS Integration & Script Embedding
- **Script-Tag Embed SDK (`accessbridge.js`)**:
  ```html
  <div id="accessbridge-player" data-lesson-id="lesson-001" data-lang="am" data-theme="light"></div>
  <script src="/accessbridge.js" defer></script>
  ```
- **Savanna Adapter**: REST endpoints mapping Savanna course schemas and progress synchronization.
- **OpenAPI Specification**: Interactive Swagger UI at `/api/v1/docs` and ReDoc at `/api/v1/redoc`.

---

## ⌨️ AccessPlayer Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> or <kbd>K</kbd> | Play / Pause media |
| <kbd>J</kbd> or <kbd>Left Arrow</kbd> | Seek backward 10 seconds |
| <kbd>L</kbd> or <kbd>Right Arrow</kbd> | Seek forward 10 seconds |
| <kbd>Up Arrow</kbd> | Increase volume (+10%) |
| <kbd>Down Arrow</kbd> | Decrease volume (-10%) |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>C</kbd> | Toggle Closed Captions (CC) |
| <kbd>S</kbd> | Toggle Ethiopian Sign Language (EthSL) window |
| <kbd>D</kbd> | Toggle Audio Description (AD) |
| <kbd>&lt;</kbd> / <kbd>&gt;</kbd> | Decrease / Increase playback speed |
| <kbd>F</kbd> | Toggle Fullscreen |

---

## 🚀 Running Locally

### Option 1: Native Setup

#### Backend Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m app.database.seed
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend Setup
```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open **`http://127.0.0.1:5173/`** to view the integrated platform.

### Option 2: Docker Compose

```bash
docker compose up --build
```
Access the application at `http://localhost:5173` or `http://localhost:80`.

---

## 🧪 Testing

### Backend Unit & Integration Tests
```powershell
.\.venv\Scripts\pytest backend\tests
```
Includes 18 automated tests covering health checks, HS256 JWT security, course listing, offline pack generation, progress synchronization, career listings, and certificate verification.

### Frontend Linting & Production Build
```powershell
cd frontend
npm run lint
npm run build
```

---

## ♿ Accessibility Compliance Status

- **Standard**: WCAG 2.2 Level AA target.
- **Focus Indicators**: 3px high-contrast solid focus rings across all interactive controls.
- **Color Contrast**: Maintained at $\ge 4.5:1$ for body text and $\ge 3:1$ for large headings and UI components.
- **Information Independence**: Status information is never conveyed by color alone.
- **Reduced Motion**: Honored via `prefers-reduced-motion` media query.
