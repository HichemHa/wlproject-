import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    
    // const user = await this.usersService.findOne(email);
    // console.log('first',email)
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
    return console.log('first')
  }

  async login(emailtocheck: string,passtocheck:string) : Promise<any>{
    let msg:any = {
      pm:"worng email",
      ps:"wrong password"
    }
    const userEmail = await this.usersService.findOne(emailtocheck);
    if(!userEmail){
      return msg.pm;
    }
    const isMatch = await bcrypt.compare(passtocheck, userEmail.password);
    console.log("ismatch",isMatch)
    if(isMatch){
      const payload = { email: emailtocheck };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }else{return msg.ps}

   
    
  }
}