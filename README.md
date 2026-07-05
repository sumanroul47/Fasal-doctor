# Fasal Doctor 🌾

An AI-powered crop disease detection app I built to help Indian farmers identify plant diseases just by uploading a photo.

## Why I built this

I come from Odisha, and agriculture is a big part of life around where I grew up. A lot of farmers lose crop yield every year simply because a disease isn't caught in time — by the time they notice something's wrong, it's often too late, and expert help isn't always nearby or affordable.

I wanted to see if I could use AI to fix a small part of that problem. So I built Fasal Doctor — a simple app where a farmer (or anyone) can upload a photo of a crop leaf, and the app tells you what disease it might be and what to do about it.

I presented this project at **Google AI Day for Startups India, IIT Delhi**.

## What it does

1. Upload a photo of a diseased plant/leaf
2. The app sends it to Gemini Vision API for analysis
3. You get back:
   - The likely disease name
   - A simple explanation of what it is
   - Practical treatment/prevention steps

No complicated setup for the farmer — just a photo and a few seconds.



## Tech Stack

- React + TypeScript
- Vite
- Google Gemini Vision API

## Running it locally

\`\`\`bash
git clone https://github.com/sumanroul47/Fasal-doctor.git
cd Fasal-doctor
npm install
\`\`\`

Then add your own Gemini API key:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Open \`.env.local\` and paste your key:
\`\`\`
GEMINI_API_KEY=your_key_here
\`\`\`

Run the app:
\`\`\`bash
npm run dev
\`\`\`

## What's next

Some things I want to add when I get time:

- [ ] Support for more crop types (right now it's limited)
- [ ] Hindi/Odia language support — most farmers won't use an English-only app
- [ ] Making it work better on slow internet connections
- [ ] Maybe a voice input option for ease of use

## About me

I'm Suman, self-taught in React and building with AI APIs during my drop year.I just completed my 12th and Currently prepping for engineering college — this project is one of the things I'm most proud of building on my own.

Feel free to open an issue or reach out if you want to contribute or just talk about the idea.

