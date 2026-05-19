import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load the secret key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Connecting to Google...")

try:
    # Ask Google for every model this key has access to
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE MODEL: {m.name}")
except Exception as e:
    print(f"❌ ERROR: {e}")