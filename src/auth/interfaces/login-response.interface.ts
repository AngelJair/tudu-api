import { Usuario } from "../entities/auth.entity";

export interface LoginResponse{
    usuario: Usuario,
    token: string
}