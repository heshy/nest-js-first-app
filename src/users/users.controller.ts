import { Body, Controller, Get, Param, Patch, Post, Delete, Query, ParseIntPipe, ValidationPipe, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';  
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
   
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(@Query('role') role?:'INTERNS' | 'ENGINEER' | 'ADMIN'){
        console.log(`Finding all users with role: ${role}`);
        return this.usersService.findAll(role);
    }    

    @Get(':id')
    findOne(@Param('id',ParseIntPipe) id: number) {
        console.log(`Finding user with id: ${id}`);
        return this.usersService.findOne(id);
    }

    @Post()
    createUser(@Body(ValidationPipe) createUserDto: CreateUserDto){

        console.log('Creating user:', createUserDto);
        return this.usersService.ceateUser(createUserDto);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {

        console.log(`Updating user ${id}:`, updateUserDto); 
        return this.usersService.updateUser(id, updateUserDto);
    }

   @Delete(':id')
   deleteUser(@Param('id',ParseIntPipe) id: number) {
        
        return this.usersService.deleteUser(id);
    }
    
}

