from fastapi import FastAPI

from classes import Query
from controllers import process_user_query

app = FastAPI()


@app.get("/")
def default():
    return {"message": "Home Page"}


@app.post("/query")
def processQuery(request: Query):
    return process_user_query(request.query)
