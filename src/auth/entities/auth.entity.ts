import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    _id?: string;
    @Prop({
        unique: true,
        required: true
    })
    email: string;

    @Prop({
        unique: true,
        required: true,
        minlength: 6,
    })
    password?: string;

    @Prop({
        default: true
    })
    isActive: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
