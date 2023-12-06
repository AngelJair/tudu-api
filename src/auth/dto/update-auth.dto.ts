import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateUsuarioDto) {}
