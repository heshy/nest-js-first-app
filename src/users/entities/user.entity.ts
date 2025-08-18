import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
export class User{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar', length: 100 })
    name: string;

    @Column({unique:true}) 
    email: string;

    @Column({type: 'enum', enum: ['INTERNS', 'ENGINEER', 'ADMIN'], default: 'INTERNS',nullable: false})
    role:string;

}

