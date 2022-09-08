
import { Controller, Get, Request, Post,Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly service: UsersService,
    ) {}

  
  @Post('auth/login')
  async login(@Request() req) {
    
    return this.authService.login(req.body.email,req.body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.email;
  }
  @Post('user/create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.service.create(createUserDto);
  }
  @Get('user')
  async index() {
    // return {
    //     data: await this.service.findAll(),
    //     msg:'data is here'
    // };
    try {
      let x = await this.service.findAll();
      return {
        data: x,
        msg: 'data is here',
      };
    } catch (error) {
        return {
            data: error,
            msg: 'datq problem',
          };
    }
  }

}
