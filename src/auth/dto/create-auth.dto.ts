import { IsEmail, MinLength, IsString } from "class-validator";

export class CreateUsuarioDto {
    @IsEmail()
    email: string;

    @MinLength(6)
    @IsString()
    password: string;
}
