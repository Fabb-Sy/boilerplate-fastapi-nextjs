# System Architecture & Design Blueprint

Dokumen ini mendefinisikan arsitektur sistem, pemisahan layer (*layer boundaries*), alur kerja data (*data flow*), serta pola desain (*design patterns*) yang wajib diikuti pada seluruh project berbasis boilerplate ini.

---

## 1. High-Level System Architecture

Arsitektur sistem menggunakan pola **Decoupled Fullstack Monorepo** yang diorkestrasi oleh Docker Compose:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                  Next.js 15 Frontend (App Router)           │
│  - Port: 3000                                               │
│  - UI: TailwindCSS + Lucide Icons                           │
│  - API Client: Standardized Fetch Wrapper (@/services)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ API Requests (REST / CORS)
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                  FastAPI 0.115+ Backend                     │
│  - Port: 8000                                               │
│  - Validation: Pydantic v2 (Strict Schema)                  │
│  - Asynchronous Tasks: asyncio Worker Pipeline              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Volume Mount / Read-Write
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                    Shared Storage System                    │
│  - storage/inputs/   (Uploaded raw media/files)             │
│  - storage/outputs/  (Rendered/processed files)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Layer Boundaries & Responsibilities

Backend dibagi secara tegas ke dalam 4 layer utama di dalam folder `backend/app/`:

### A. Layer `core/` (Fondasi & Konfigurasi)
- **Tanggung Jawab:** Mengelola konfigurasi environment global, inisialisasi Pydantic settings, exception handler global, dan middleware.
- **Aturan:** Layer ini tidak boleh mengimpor layer `api/` atau `services/` (mencegah *circular dependency*).

### B. Layer `schemas/` (Data Transfer Objects / Pydantic Models)
- **Tanggung Jawab:** Validasi ketat terhadap input request dari client dan serialisasi output respon API.
- **Standar:** Seluruh respon API wajib dibungkus dalam generic `ApiResponse[T]`:
  ```python
  class ApiResponse(BaseModel, Generic[T]):
      success: bool = True
      message: str = "Operation successful"
      data: Optional[T] = None
      errors: Optional[Any] = None
  ```

### C. Layer `services/` (Pure Business Logic & Pipelines)
- **Tanggung Jawab:** Seluruh pemrosesan logika bisnis, manipulasi data, integrasi AI (OpenAI, Groq, Gemini), serta pemrosesan file (FFmpeg, OpenCV, Whisper).
- **Aturan Emas:**
  - `Service` **tidak boleh** mengakses objek HTTP `Request` atau `Response` dari FastAPI secara langsung.
  - Seluruh parameter input diterima berupa tipe data murni Python atau objek Schema Pydantic.
  - Hal ini memastikan unit testing dapat dilakukan tanpa perlu me-mock HTTP context.

### D. Layer `api/v1/endpoints/` (Transport / Routing Layer)
- **Tanggung Jawab:** Menerima HTTP request, melakukan deklarasi Swagger OpenAPI tags, memanggil service layer, dan mengembalikan `ApiResponse[T]`.
- **Aturan:** Router harus dibuat seringkas mungkin (*thin controller*). Tidak boleh ada pemrosesan berat di dalam router.

---

## 3. Asynchronous Pipeline Pattern (Media & AI Jobs)

Untuk tugas yang memakan waktu lama (seperti render video, transkripsi audio, scraping, inferensi LLM batch):
1. Client mengirim request `POST /api/v1/tasks`.
2. Router langsung mengembalikan status HTTP `201 Created` dengan status task `PENDING`.
3. Background worker dieksekusi secara asinkron via `asyncio.create_task()` (atau Celery/RQ untuk multi-worker).
4. Status task bertransisi secara berurutan:  
   `PENDING` ➔ `PROCESSING` (dengan progress 0–100%) ➔ `COMPLETED` / `FAILED`.
5. Frontend melakukan polling berkala `GET /api/v1/tasks/{id}` hingga status menjadi `COMPLETED`.

---

## 4. Frontend Component & Service Architecture

Frontend Next.js diatur dengan struktur direktori berbasis domain fungsional:

- `src/services/api-client.ts`: Abstraksi panggilan API terpusat. Mengurai respon `ApiResponse<T>` secara otomatis.
- `src/types/api.ts`: Interface TypeScript yang mencerminkan Schema Pydantic di Backend.
- `src/components/ui/`: Komponen murni presentasional (Button, Card, Badge, Modal) tanpa *side-effect* bisnis.
- `src/components/common/`: Komponen layout tingkat aplikasi (Navbar, Sidebar, Footer, Toaster).
