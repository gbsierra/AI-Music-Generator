from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
from typing import List
import torchaudio
from fastapi.staticfiles import StaticFiles
from audiocraft.models import musicgen

# initialize FastAPI
app = FastAPI()

# define request model
class Prompt(BaseModel):
    prompt: str

# serve static files from the "outputs" directory
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load the MusicGen model
MODEL = musicgen.MusicGen.get_pretrained('facebook/musicgen-small')
SAMPLE_RATE = 32000

# func to generate music from a text prompt
def generate_music(prompt: str, output_path: str):
    wav = MODEL.generate([prompt], progress=True)
    torchaudio.save(output_path, wav[0].cpu(), SAMPLE_RATE)

# accepts text prompt and returns .wav
@app.post("/generate")
async def generate(prompt: Prompt):
    filename = f"{uuid.uuid4()}.wav"
    output_path = os.path.join("outputs", filename)
    os.makedirs("outputs", exist_ok=True)
    generate_music(prompt.prompt, output_path)
    return FileResponse(output_path, media_type="audio/wav")

# lists all generated audio files
@app.get("/outputs", response_model=List[str])
async def list_outputs():
    outputs_dir = "outputs"
    if not os.path.exists(outputs_dir):
        return []
    files = [f for f in os.listdir(outputs_dir) if f.endswith(".wav")]
    return files