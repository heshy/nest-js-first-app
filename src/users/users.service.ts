import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';  
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, name: 'Amaradasa Kapuduwa', email: 'heshan28@gmail.com', role: 'ENGINEER' },
        { id: 2, name: 'Hasitha Kapuduwa', email: 'amamam@mgmgm.com',role: 'ENGINEER' },
        { id: 3, name: 'Isuru Kapuduwa', email: 'isuru@gmail.com',role: 'INTERNS' },
        { id: 4, name: 'Yuvin Kapuduwa', email: 'yuvin@gmail.com',role: 'ADMIN' }

    ];

    findAll(role?: 'INTERNS' | 'ENGINEER' | 'ADMIN') {
   
        const usersList = this.users.filter(user => user.role === role || !role);        
        if(usersList.length === 0) {
            throw new NotFoundException(`No users found with role ${role}`);
        }
        return this.users
       
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id);
        console.log(`User found: ${JSON.stringify(user)}`);
        if(!user) throw new NotFoundException(`User with id ${id} not foundsss`);
        return user;
    }

    ceateUser(createUserDto: CreateUserDto) {
        const highestUserId = [...this.users].sort((a, b) => b.id - a.id);
        const newUser = { id: highestUserId[0].id + 1, ...createUserDto };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id: number, updateUserDto: UpdateUserDto) {
        this.users  = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...updateUserDto };
            }
            return user;
        }
        );

        return this.findOne(id);
    }

    deleteUser(id: number) {
        console.log(`Deleting user with id: ${id}`);
        this.users = this.users.filter(user => user.id !== id);
        return { id, deleted: true };
    }
}
