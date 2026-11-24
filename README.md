# Fullstack Studio Boilerplate (FastAPI + Next.js + Docker)

Boilerplate fullstack modern, ringan (*lean*), dan berorientasi *local-first* berbasis **FastAPI (Python)** dan **Next.js 15 (React 19, TypeScript, TailwindCSS)** yang diorkestrasi menggunakan **Docker Compose**.

Sangat cocok untuk membangun aplikasi **AI Video/Audio Studio, Media Clipper, Content Repurposing Tools, Scraper Automation, atau AI Agent Pipeline**.

---

## ⚡ Fitur Utama

- **FastAPI 0.115+ Backend:** Arsitektur asinkron super cepat, auto-generated Swagger OpenAPI Docs (`/docs`), validasi ketat via **Pydantic v2**.
- **Next.js 15 Frontend:** React 19, App Router, TypeScript, TailwindCSS, dan ikon Lucide.
- **Unified API Response Envelope:** Seluruh respon API konsisten terbungkus dalam format standar `{ success, data, message, errors }`.
- **Asynchronous Task/Pipeline Pattern:** Contoh pipeline worker antrian tugas (simulasi render/AI background job) siap pakai.
- **Shared Storage Volume:** Folder `storage/inputs` dan `storage/outputs` tersambung langsung antara container Docker dan host mesin.
- **Developer Experience:** Hot-reload aktif untuk backend (Uvicorn `--reload`) dan frontend (Next.js Fast Refresh).
- **Strict Guidelines & Documentation:** Dilengkapi dengan [ARCHITECTURE.md](ARCHITECTURE.md) dan [CONVENTIONS.md](CONVENTIONS.md).

---

## 🚀 Panduan Memulai (Quick Start)

### Menjalankan Menggunakan Docker Compose (Direkomendasikan)

1. **Salin file environment:**
   ```bash
   cp .env.example .env
   ```

2. **Jalankan seluruh service:**
   ```bash
   docker compose up --build -d
   ```

3. **Akses aplikasi di browser:**
   - **Frontend Studio UI:** [http://localhost:3000](http://localhost:3000)
   - **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Shared Output Media:** `./storage/outputs/`

---

## 🛠️ Menjalankan Secara Lokal (Native Development)

### 1. Menjalankan Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # atau .venv\Scripts\activate di Windows
pip install -r requirements.txt

# Jalankan server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Menjalankan Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Menjalankan Automated Tests

Test otomatis backend dapat dijalankan langsung:

```bash
# Menggunakan Docker:
docker compose exec backend pytest -v

# Menggunakan local virtualenv:
cd backend
pytest -v
```

---

## 📂 Struktur Monorepo

```
boilerplate-fastapi-nextjs/
├── docker-compose.yml       # Orkestrasi Docker (backend:8000, frontend:3000)
├── ARCHITECTURE.md          # Penjelasan desain layer & pipeline
├── CONVENTIONS.md           # Standar penamaan kode, response envelope, rules AI
├── backend/                 # FastAPI Application
│   ├── app/
│   │   ├── core/            # Config & custom exception handlers
│   │   ├── schemas/         # Pydantic request & response models
│   │   ├── services/        # Business logic, AI, video/audio workers
│   │   └── api/v1/          # Endpoints router (/health, /tasks)
│   └── tests/               # Pytest test cases
├── frontend/                # Next.js Application
│   └── src/
│       ├── app/             # App Router pages & layout
│       ├── components/      # UI primitives & layout components
│       ├── services/        # Unified API Client
│       └── types/           # TypeScript contract models
└── storage/                 # Shared file volume
    ├── inputs/              # File mentah (video/audio/data input)
    └── outputs/             # File hasil proses pipeline
```

---

## 📜 Lisensi

Starter kit ini dilisensikan di bawah [MIT License](LICENSE).
