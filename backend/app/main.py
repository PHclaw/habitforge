from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, habits, checkins, social, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

origins = ["*"] if settings.DEBUG else [f"https://{os.getenv('RAILWAY_PUBLIC_DOMAIN', 'habitforge.up.railway.app')}"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(habits.router, prefix="/api")
app.include_router(checkins.router, prefix="/api")
app.include_router(social.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

frontend_path = os.getenv("FRONTEND_PATH", "../frontend/dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}