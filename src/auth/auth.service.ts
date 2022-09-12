import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  

  async login(emailtocheck: string, passtocheck: string): Promise<any> {
    let msg: any = {
      pm: 'worng email',
      ps: 'wrong password',
    };
    const userEmail = await this.usersService.findOne(emailtocheck);
    if (!userEmail) {
      return msg.pm;
    }
    const isMatch = await bcrypt.compare(passtocheck, userEmail.password);
    console.log('ismatch', isMatch);
    if (isMatch) {
      const payload = { email: emailtocheck };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      return msg.ps;
    }
  }
}
