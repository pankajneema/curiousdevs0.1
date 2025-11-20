from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config

MONGO_URI = config(
    "MONGO_URI",
    default="mongodb+srv://pankaj200321:Pankaj%40curious1@pankajcluster.wkn8k.mongodb.net/?retryWrites=true&w=majority"
)

client = AsyncIOMotorClient(MONGO_URI)
db = client["project_management"]
