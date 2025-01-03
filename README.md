# Team1515 Backend

## Description
Backend service for the Team1515 robotics team website, built with TypeScript, Firebase, and Vercel Serverless Functions. This service handles contact form submissions and newsletter subscriptions.

## Technologies Used
- TypeScript
- Firebase Admin SDK
- Vercel Serverless Functions
- Zod (Schema Validation)
- CORS

## API Endpoints

### Contact Form
`POST /api/contact`
Handles contact form submissions with validation for:
- Name
- Email
- Subject
- Message

### Newsletter
`POST /api/newsletter`
Manages newsletter subscriptions with:
- Email validation
- Duplicate subscription prevention
- Subscription status tracking

## Project Structure
eam1515-backend/
├── src/
│ └── lib/
│ └── firebase-admin.ts
├── api/
│ ├── contact/
│ │ └── index.ts
│ └── newsletter/
│ └── index.ts
├── vercel.json
├── tsconfig.json
└── package.json

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project
- Vercel CLI (optional for local development)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Firebase credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Development
Run the development server:
```bash
npm run dev
```

### Deployment
Deploy to Vercel:
```bash
npm run deploy
```

## Environment Variables
Make sure to set these in your Vercel project settings:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

## Security
- CORS enabled for secure cross-origin requests
- Input validation using Zod
- Firebase Admin SDK for secure database operations

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
s.safamovich@gmail.com


