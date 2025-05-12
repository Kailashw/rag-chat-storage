# 🧠 RAG Chat System (Groq + NestJS + ChromaDB)

A full Retrieval-Augmented Generation system combining:

- ✨ **Groq API** for ultra-fast LLM inference (Mixtral, LLaMA)
- 🧱 **NestJS** as the orchestrator and microservice framework
- 🧠 **ChromaDB + sentence-transformers** for context retrieval
- 💬 **Chat Storage Service** with session/message APIs and PostgreSQL
- 🐳 Fully Dockerized with multi-service orchestration
- 📘 Swagger API docs and Postman collection provided

---

## 📐 Architecture

```
User → RAG Gateway (NestJS)
       ├─▶ /embed/query → Python Retriever (FastAPI + Chroma)
       ├─▶ /chat/completions → Groq API (LLM inference)
       └─▶ /messages        → Chat Storage Service (NestJS + PostgreSQL)
```

---

## 🚀 Quick Start

### 1. Clone and Set Up Environment

```bash
git clone https://github.com/yourname/rag-chat-system.git
cd rag-chat-system
cp backend/.env.example backend/.env
cp rag-gateway/.env.example rag-gateway/.env
```

Update `.env` values:
- GROQ_API_KEY
- STORAGE_API_KEY

---

### 2. Start All Services

```bash
docker-compose up --build
```

Accessible at:
- Gateway: `http://localhost:3001`
- Storage: `http://localhost:3000/docs`
- Retriever: `http://localhost:8001/docs`
- pgAdmin: `http://localhost:5050`

---

### 3. Prisma Migration and Restart services.
Run below command in Storage(Backend) service with in docker command prompt.
```
npx prisma migrate deploy
```
and then restart the services.

## API Flow

Example Flow:
1. Create Session
2. Add few messages
3. POST `/rag/ask` → Question
4. View stored messages

---

## 📦 Services Breakdown

### 🔹 backend/
- NestJS app to manage sessions/messages
- PostgreSQL via Prisma
- Swagger at `/docs`
- Secured with x-api-key, rate limiting

### 🔹 python-retriever/
- FastAPI for `/embed`, `/query`, `/add-docs`
- Uses `all-MiniLM-L6-v2` for embeddings
- Powered by local ChromaDB (DuckDB+Parquet)

### 🔹 rag-gateway/
- NestJS orchestrator for the RAG pipeline
- Connects to Groq, Retriever, and Storage
- Route: `POST /rag/ask`

---

## ⚙️ Docker Compose

```bash
docker-compose up --build
```

- `backend` → port 3000
- `rag-gateway` → port 3001
- `python-retriever` → port 8001
- `pgadmin` → port 5050

---

## 📘 API Keys

Pass `x-api-key: storage-api-key` in headers when calling `/sessions` or `/messages`.

---

## ✅ Features

- Create, rename, delete, favorite sessions
- Add messages with optional context
- Retrieve messages with pagination
- Embedding + retrieval using Python
- Ultra-fast generation via Groq

---

## 🧪 TODO (extensions)

- Add authentication for users
- Hook vector DB to real doc ingestion pipeline
- Add streaming LLM response support

---

## 📄 License

MIT