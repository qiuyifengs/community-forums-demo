import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * 角色守卫。基于角色的守卫
 */
@Injectable()
export class RolesGuard implements CanActivate {
    /**
     * 初始化角色守卫
     * @param reflector 反射器
     */
    constructor(private readonly reflector: Reflector) { }

    /**
     * 是否通过
     * @param context 执行上下文
     */
    canActivate(context: ExecutionContext): boolean {
        const handler = context.getHandler();
        const roles = this.reflector.get<string[]>('roles', handler);
        if (!roles) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const hasRole = () => !!user.roles.find((role) => !!roles.find((item) => item === role));
        return user && user.roles && hasRole();
    }
}