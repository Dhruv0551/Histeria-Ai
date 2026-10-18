from fastapi import FastAPI

from controllers import process_user_query

app = FastAPI()


@app.get("/")
def default():
    return {"message": "Home Page"}


@app.post("/query")
def processQuery(query: str):
    return process_user_query(query)
