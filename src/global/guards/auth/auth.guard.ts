import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/global/tools/interfaces/jwtpayload.interface';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private authService: AuthService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers['authorization']?.split(' ') ?? []; 

    if(type != 'Bearer'){
      throw new UnauthorizedException('No tiene autorizacion para acceder aqui')
    }

    try {
      const payload = await this.JwtService.verifyAsync<JwtPayload>(token, {secret: process.env.JWT_SEED})
      if (!payload.id) {
        throw new UnauthorizedException('No se recibio información de usuario')
      }

      const usuario = await this.authService.findOne(payload.id);
      request ['usuario'] = usuario;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
