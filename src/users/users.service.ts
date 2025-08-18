import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(role?: 'INTERNS' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            return await this.userRepository.findBy({ role });
        }
        return await this.userRepository.find();
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async createUser(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto);
        return await this.userRepository.save(newUser);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async deleteUser(id: number) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return { id, deleted: true };
    }
}
