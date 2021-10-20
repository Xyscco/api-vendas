import { NextFunction, Request, Response } from "express";
import AppError from "@shared/errors/appError";
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticaded(request:Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError('Token não encontrado');
    }

    const [, token] = authHeader.split(' ');

    try {
      const decodeToken = verify(token, authConfig.jwt.secret);

      const { sub } = decodeToken as ITokenPayLoad;

      request.user = {
        id: sub,
      }

      return next();
    } catch {
        throw new AppError('Token inválido!');
    }

}
