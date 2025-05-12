from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient
from chromadb.config import Settings

# Init
app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

client = PersistentClient(path="./chroma")
collection = client.get_or_create_collection(name="rag_docs")

# Schemas
class EmbedRequest(BaseModel):
    texts: list[str]

class QueryRequest(BaseModel):
    query: str
    top_k: int = 3

# Endpoints
@app.post("/embed")
def embed(req: EmbedRequest):
    vectors = model.encode(req.texts).tolist()
    return {"embeddings": vectors}

@app.post("/add-docs")
def add_docs(req: EmbedRequest):
    docs = req.texts
    ids = [f"doc_{i}" for i in range(len(docs))]
    vectors = model.encode(docs).tolist()
    collection.add(documents=docs, embeddings=vectors, ids=ids)
    return {"added": len(docs)}

@app.post("/query")
def query(req: QueryRequest):
    query_vec = model.encode([req.query]).tolist()
    results = collection.query(query_embeddings=query_vec, n_results=req.top_k)
    return {
        "documents": results["documents"][0],
        "metadatas": results["metadatas"][0] if "metadatas" in results else []
    }
