from pymongo import AsyncMongoClient
from decouple import config

client = AsyncMongoClient(config("MONGO_URI", default="mongodb+srv://curiousdevs1:RGgPjdC3WmCMcdoJ@curiousdevs.bgpafim.mongodb.net/curiousdevsdb?retryWrites=true&w=majority&appName=curiousdevs"))
db = client["project_management"]
