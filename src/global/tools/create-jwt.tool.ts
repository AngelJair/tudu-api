import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwtpayload.interface";

export const createJwt=( payload: JwtPayload, JwtService: JwtService): string =>{
    return JwtService.sign(payload)
}