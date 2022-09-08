
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
// // This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model:Model<UserDocument>,
  ){}
  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find(user => user.username === username);
  // }
  async findAll(): Promise<User[]> {
    return await this.model.find().exec();
  }
  async findOne(email: string): Promise<User | undefined>  {
    // return await this.model.find(User=>User.email===email);
    try {
      let responseData: any =  await this.model.findOne({email});
     
      return responseData;
    } catch (error) {
      console.log(error.message)
      return null
    }
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    
    let em:string = createUserDto.email;
    console.log("em",em)
    var msg:any={d:"User Exist aleady"};
    try {
      let checkemail: any =  await this.model.findOne({email:em});
      console.log("checkemail for create user ",checkemail)
      if (checkemail) {
       return msg.d;
      }
      
      return await new this.model({
        email:createUserDto.email,
        password:hashedPassword
      }).save()
    } catch (error) {
      return error.message
    }
  }
  
  async delete(id:string):Promise<User>{
    return await this.model.findByIdAndDelete(id).exec()
  }
}
