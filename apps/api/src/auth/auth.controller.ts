import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport'; // We'll add LocalAuthGuard later if needed, or just manual logic for now
// For simplicity in this iteration, we might use manual validation in the service or just pass DTOs.
// But usually one uses LocalStrategy for login. Let's keep it simple: POST /auth/login accepts body.

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // In a real app, use LocalAuthGuard. Here assuming `req` contains email/password
        // But wait, `login` service expects a user object (result of validation). 
        // Let's assume validation happens here for simplicity or use a Guard.
        // For proper pattern: 
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { message: 'Invalid credentials' }; // Or throw Unauthorized
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: any) {
        return this.authService.register(createUserDto);
    }

    // Example protected route
    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //   return req.user;
    // }
}
