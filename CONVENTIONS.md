# Coding Conventions & Development Rules

Panduan ini berisi konvensi penamaan, standar kode, penanganan error, serta checklist kepatuhan untuk pengembang dan **AI Coding Assistants**.

---

## 1. Naming Conventions

| Konteks | Standar | Contoh |
|---|---|---|
| **Python Files & Folders** | `snake_case` | `task_service.py`, `video_helpers.py` |
| **Python Classes** | `PascalCase` | `TaskService`, `ApiResponse` |
| **Python Functions & Vars** | `snake_case` | `calculate_progress()`, `task_id` |
| **Python Constants** | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE_MB`, `API_V1_STR` |
| **TypeScript Files (General)** | `kebab-case` atau `camelCase` | `api-client.ts`, `formatDate.ts` |
| **React Component Files** | `PascalCase.tsx` | `Button.tsx`, `Navbar.tsx` |
| **TypeScript Types & Interfaces** | `PascalCase` | `TaskItem`, `ApiResponse<T>` |
| **TypeScript Variables & Functions** | `camelCase` | `fetchTaskStatus()`, `isHealthy` |
| **API Endpoints (RESTful)** | `kebab-case` (Plural) | `/api/v1/tasks`, `/api/v1/video-clips` |

---

## 2. Python & FastAPI Code Rules

1. **Type Annotations Wajib:**
   Semua fungsi dan method harus memiliki type hints lengkap:
   ```python
   # BENAR:
   async def get_task_by_id(task_id: str) -> Optional[TaskResponse]:
       ...

   # SALAH:
   def get_task(task_id):
       ...
   ```
2. **Standardized Exception Handling:**
   Gunakan custom `AppException` untuk error bisnis yang diharapkan:
   ```python
   # BENAR:
   raise AppException(message="Clip duration exceeds limit", status_code=status.HTTP_400_BAD_REQUEST)

   # SALAH:
   raise HTTPException(status_code=400, detail="error")
   ```
3. **No Hardcoded Secrets/Paths:**
   Seluruh kredensial, API key, dan path file harus dibaca dari `app.core.config.settings`.
4. **Clean Dependencies:**
   Jaga `requirements.txt` tetap minimal. Gunakan library native `asyncio`, `pathlib`, `json` sebelum menambahkan package pihak ketiga.

---

## 3. TypeScript & Next.js Rules

1. **Strict Type Safety:**
   Dilarang menggunakan `any` tanpa alasan yang terdokumentasi jelas.
2. **Standard API Wrapper:**
   Dilarang memanggil `fetch()` atau `axios` secara bebas langsung di dalam komponen UI. Seluruh panggilan jaringan wajib melalui modul `@/services/api-client.ts`.
3. **Client vs Server Components:**
   - Gunakan `"use client";` hanya ketika komponen membutuhkan interaktivitas (`useState`, `useEffect`, event listener).
   - Simpan komponen statis atau fetch awal sebagai Server Components secara default.

---

## 4. Universal Response Envelope Matrix

Setiap endpoint API harus mematuhi format respon JSON berikut:

### Sukses:
```json
{
  "success": true,
  "message": "Task queued successfully",
  "data": {
    "id": "e4b6c31a-...",
    "status": "PENDING"
  },
  "errors": null
}
```

### Gagal / Validasi Error:
```json
{
  "success": false,
  "message": "Task with ID 'xyz' not found",
  "data": null,
  "errors": [
    { "field": "title", "error": "Field required" }
  ]
}
```

---

## 5. Instruksi Khusus untuk AI Coding Assistants (Agent Guidelines)

Bila Anda (AI Agent) memodifikasi atau menambah fitur pada repository ini:
1. **Patuhi Service Layer Pattern:** Jangan pernah menaruh logika pemrosesan file, audio, atau AI langsung di dalam file `endpoints/*.py`. Selalu buat class atau fungsi di dalam `app/services/`.
2. **Pertahankan Response Envelope:** Pastikan router FastAPI selalu menggunakan decorator `response_model=ApiResponse[...]` dan mengembalikan instance `ApiResponse(...)`.
3. **Jaga Kebersihan Storage:** File sementara wajib disimpan di folder `storage/inputs/` atau `storage/outputs/` dan tidak boleh di-*hardcode* di folder root atau `/tmp`.
4. **Sertakan Test:** Setiap pembuatan endpoint baru di `api/v1/endpoints/` wajib disertai minimal 1 unit/integration test di folder `backend/tests/`.
