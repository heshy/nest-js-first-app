import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()   
    name:string;

    @IsEmail()
    email:string;

    @IsEnum(['INTERNS', 'ENGINEER', 'ADMIN'],{message: 'Role must be one of INTERNS, ENGINEER, or ADMIN'})
    role: 'INTERNS' | 'ENGINEER' | 'ADMIN';
}