from classes import Query
from controllers import process_user_query
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def default():
    return {"message": "Home Page"}


@app.post("/query")
def processQuery(request: Query):
    thread_id = "Convo-Memory 1"
    return process_user_query(request.query, thread_id)
