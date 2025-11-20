from fastapi import FastAPI
from routes import auth, user, project, bill,lead,newsletter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# ✅ Allow all origins (for development use only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(project.router)
app.include_router(bill.router)
app.include_router(lead.router)
app.include_router(newsletter.router)