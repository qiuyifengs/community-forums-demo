import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import{LoginService} from '../login/login.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersServices: LoginService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     // passReqToCallback: false,
      secretOrKey: '123',
    });
  }

  async validate(payload: JwtPayload) {

    console.log('entered jwt')
    console.log(payload.userId);
    
    const user = await this.authService.validate(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
export const callback = (err, user, info) => {
    let message;
    if (err) {
        //return (err || new UnauthorizedException(info.message));
        throw err;
    } else if (typeof info !== 'undefined' || !user) {
        switch (info.message) {
            case 'No auth token':
            case 'invalid signature':
            case 'jwt malformed':
            case 'invalid token':
            case 'invalid signature':
                message = 'You must provide a valid authenticated access token';
                break;
            case 'jwt expired':
                message = 'Your session has expired';
                break;
            default:
                message = info.message;
                break;
        }
        throw new UnauthorizedException(message);
    }
    return user;
};
