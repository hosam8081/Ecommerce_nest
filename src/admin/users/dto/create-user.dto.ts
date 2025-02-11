import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/auth/user.entity";

export class CreateUserDto {

      @IsEmail()
      email: string;


      @IsNotEmpty()
      @IsString()
      first_name: string;


      @IsNotEmpty()
      @IsString()
      last_name: string;

      @IsNotEmpty()
      @IsString()
      @MinLength(8, { message: "Password must be at least 8 characters long" })
      @MaxLength(32, { message: "Password must not exceed 32 characters" })
      password: string;

      @IsEnum(UserRole, { message: "Invalid role, must be one of: ADMIN, USER, etc." })
      role: UserRole = UserRole.USER; // Default role is USER

}
