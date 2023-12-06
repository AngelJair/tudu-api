import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/global/guards/auth/auth.guard';
import { LoginResponse } from './interfaces/login-response.interface';
import { createJwt } from 'src/global/tools/create-jwt.tool';
import { JwtService } from '@nestjs/jwt';
import { ListResponse } from './interfaces/list-response.interface';
import { Usuario } from './entities/auth.entity';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private JwtService: JwtService  
  ) {}

  @Post()
  async create(@Body() createAuthDto: CreateUsuarioDto)/*: Promise<Usuario>*/ {
    return this.authService.create(createAuthDto);

    //Habilitar session al registrarse
    // const usuario = await this.authService.create(createAuthDto);
    // return {
    //   usuario,
    //   token: ''
    // }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse>{
    const usuario = await this.authService.login(loginDto);
    return{
      usuario,
      token: createJwt({id: usuario._id}, this.JwtService)
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req: Request): Promise<ListResponse> {
    const usuario = await this.authService.findAll();
    const usuarioLogeado = req['usuario'] as Usuario;
    return{
      usuarios: usuario,
      token: createJwt({id: usuarioLogeado._id}, this.JwtService)
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: Request): Promise<LoginResponse> {
    const usuario = await this.authService.findOne(id);
    const usuarioLogeado = req['usuario'] as Usuario;
    return{
      usuario,
      token: createJwt({id: usuarioLogeado._id}, this.JwtService)
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto, @Request() req: Request): Promise<LoginResponse> {
    const usuario = await this.authService.update(id, updateAuthDto);
    const usuarioLogeado = req['usuario'] as Usuario;
    return{
      usuario,
      token: createJwt({id: usuarioLogeado._id}, this.JwtService)
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
