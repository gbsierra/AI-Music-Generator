# AI Music Generator 🎵


## 🚀 Getting Started

### 1. Create and Activate a Virtual Environment in the Backend directory

### Navigate to backend
```bash
cd backend
```

#### Windows (Command Prompt)
```bash
python -m venv venv
venv\Scripts\activate
```
#### Windows (PowerShell)
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```
#### macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Backend
While still in backend directory:
```bash
python -m uvicorn main:app --reload
```
- Server runs at: http://localhost:3000
- API docs: http://localhost:8000/docs

### 4. Run the Frontend
In a new terminal:
```bash
cd frontend
npm install
npm start
```
---

## 🧪 Example Request

1. Go to http://localhost:8000/docs
2. Click `POST /generate`
3. Click "Try it out"
4. Enter:
{
  "prompt": "lofi chill beat"
}
5. Click "Execute" to receive a `.wav` file. (cannot be directly played through FastAPI's documentation website)
---