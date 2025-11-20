from pymongo import AsyncMongoClient
from decouple import config

client = AsyncMongoClient(config("MONGO_URI", default="mongodb+srv://pankaj200321:Pankaj@curious1@pankajcluster.wkn8k.mongodb.net/?appName=pankajcluster"))
db = client["project_management"]
