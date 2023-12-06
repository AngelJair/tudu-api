import { LoginDto } from './dto/login.dto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Usuario } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt";
import { LoginResponse } from './interfaces/login-response.interface';
import { createJwt } from 'src/global/tools/create-jwt.tool';
import { JwtService } from '@nestjs/jwt';
import { ListResponse } from './interfaces/list-response.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private JwtService: JwtService
  ){}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {

    try {
      createUsuarioDto.password = bcrypt.hashSync(createUsuarioDto.password, 10);
      const newUsuario = new this.usuarioModel(createUsuarioDto);
      await newUsuario.save()
      const usuario = newUsuario.toJSON();

      return usuario;
    } catch (error: any) {
      console.log(error);
      if (error.code == 11000) {
        throw new BadRequestException(`${createUsuarioDto.email} ya esta registrado`);
      }
      throw new InternalServerErrorException('Mi primera chamba');
    }
  }

  async login(LoginDto: LoginDto): Promise<Usuario>{
    const {email, password} = LoginDto;
    const usuario = await this.usuarioModel.findOne({
      //email: email,
      email
    });

    if (!usuario) {
      throw new NotFoundException(`No se encontro usuario con el email ${email}`);
    }

    if (bcrypt.compareSync(password, usuario.password)) {
      throw new UnauthorizedException(`La contraseña de usuario es incorrecta`);
    }

    const {password:_, ...user} = usuario.toJSON();

    return user
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.find();
    return usuarios.map(usuario => {
      const {password, ...rest} = usuario.toJSON();
      return rest;
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById({id});
    const {password, ...rest} = usuario.toJSON(); 
    return rest;
  }

  async update(id: string, usuario: UpdateAuthDto) {
    await this.usuarioModel.updateOne({id}, usuario);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Usuario> {
    //Hacer baja logica 
    const usuario = await this.usuarioModel.findOne({id});

    if (!usuario) {
      throw new NotFoundException('No existe usuario con ese id');
    }

    usuario.isActive = false;

    this.usuarioModel.updateOne({id: id}, usuario)
    return usuario;
  }
}
