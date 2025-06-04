import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    let username = 'anonymous';
    const action = `${req.method} ${req.originalUrl}`;
    
    // Extract username from JWT token if available
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        username = decoded['username'] || 'authenticated';
      } catch (error) {
        username = 'invalid-token';
      }
    }
    
    const logEntry = `${timestamp} | ${username} | ${action}\n`;
    
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFile(
      path.join(logsDir, 'app.log'),
      logEntry,
      { flag: 'a+' },
      (err) => {
        if (err) {
          console.error('Failed to write to log file:', err);
        }
      }
    );
    
    next();
  }
}