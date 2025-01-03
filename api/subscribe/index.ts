import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../src/lib/firebase-admin';
import cors from 'cors';
import { z } from 'zod';

const corsMiddleware = cors({ 
  origin: [
    'https://team1515.vercel.app', 
    'http://localhost:3000',
    'http://localhost:5173',
    'https://team1515-scoooozy-scoooozys-projects.vercel.app'
  ],
  credentials: true 
});

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request received:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  try {
    // CORS handling
    await new Promise((resolve, reject) => {
      corsMiddleware(req, res, (result) => {
        if (result instanceof Error) {
          console.error('CORS Error:', result);
          return reject(result);
        }
        return resolve(result);
      });
    });

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate Firebase connection
    if (!db) {
      console.error('Firebase DB not initialized');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Validate request body
    try {
      const validatedData = subscribeSchema.parse(req.body);
      console.log('Validated data:', validatedData);

      // Check if email already exists
      const existingSubscriber = await db
        .collection('subscribers')
        .where('email', '==', validatedData.email)
        .get();

      if (!existingSubscriber.empty) {
        return res.status(400).json({ 
          error: 'Email already subscribed' 
        });
      }

      // Add new subscriber
      const docRef = await db.collection('subscribers').add({
        ...validatedData,
        subscribedAt: new Date().toISOString(),
        status: 'active'
      });

      console.log('Document written with ID:', docRef.id);

      return res.status(201).json({ 
        success: true, 
        message: 'Successfully subscribed!' 
      });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: validationError.errors 
        });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 