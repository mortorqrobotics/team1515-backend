import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../src/lib/firebase-admin';
import cors from 'cors';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const corsMiddleware = cors({ origin: true });

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validatedData = contactSchema.parse(req.body);
    
    // Store in Firebase
    await db.collection('contact_submissions').add({
      ...validatedData,
      createdAt: new Date().toISOString(),
      status: 'new'
    });

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to team's email
      replyTo: validatedData.email, // Allow replying to the sender
      subject: `Website Contact: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 