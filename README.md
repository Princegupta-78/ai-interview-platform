# 🚀 AI Interview Platform & OA Simulator

**🌟 [Click Here to View the Live Application](https://ai-interview-platform-chi-six.vercel.app)**

> A comprehensive, full-stack platform designed...

> A comprehensive, full-stack platform designed to simulate high-stakes software engineering interviews. Featuring a custom C++ remote code execution engine, real-time AI-driven behavioral interviews, and resume-based technical loops.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![C++](https://img.shields.io/badge/C++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

---

## ✨ Core Features

### 💻 1. Online Assessment (OA) Simulator
A fully functional remote code execution sandbox built to mimic platforms like HackerRank and LeetCode.
* **Dynamic Generation:** Generates algorithmic problems (DP, Graphs, Arrays) tailored to specific target roles and difficulties using Gemini LLM.
* **Isolated Execution:** Compiles and executes C++ submissions safely on the backend using Python's `subprocess`.
* **Algorithmic Evaluation:** Tests user code against hidden test cases, evaluating edge cases and returning real-time pass/fail metrics.
* **Interactive IDE:** Integrated Monaco Editor with syntax highlighting and responsive UI.

### 🎙️ 2. Real-Time AI Mock Interviewer
A browser-based conversational AI that conducts structured behavioral and technical interviews.
* **WebRTC & Audio APIs:** Captures live webcam feeds and utilizes Web Speech API for real-time speech-to-text transcription.
* **Dynamic Scoring:** AI evaluates spoken answers using regex-parsed prompts to score Communication, Technical Depth, and Confidence.
* **Text-to-Speech:** Features an automated voice engine that reads questions aloud for an immersive experience.
* **PDF Report Generation:** Instantly compiles performance metrics and detailed feedback into a downloadable PDF report via `jsPDF`.

### 📄 3. Resume-Driven Technical Loops
* Parses user resumes to dynamically generate personalized interview questions based on actual project experience and listed technical skills.

### 🔐 4. Secure Architecture & Analytics
* **JWT Authentication:** Implements secure token-based user authentication.
* **Client-Side Route Protection:** Next.js middleware and hook-based verification to lock down private dashboards and interview sandboxes.
* **Performance Dashboard:** Tracks historical interview metrics, high scores, and completion rates.

---

## 🛠️ Technology Stack

**Frontend:**
* React.js & Next.js (App Router)
* Tailwind CSS (Styling)
* Monaco Editor (Code Sandbox)
* React Speech Recognition & Web Speech API

**Backend:**
* Python 3 & FastAPI
* C++ (g++) compilation pipeline
* Google Gemini Pro LLM

**Deployment:**
* Vercel (Frontend Hosting)
* Render (Backend API & Execution Engine)

---

## 🚀 Local Installation & Setup

Want to run this platform locally? Follow these steps:

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* GCC/G++ Compiler (for local C++ execution)

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/ai-interview-platform.git](https://github.com/YourUsername/ai-interview-platform.git)
cd ai-interview-platform
