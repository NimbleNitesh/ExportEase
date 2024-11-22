import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { payload } from 'src/dto/user.dto';

const { JWT_SECRET = "" } = process.env;

export class encrypt {
    static async encryptPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, 12);
    }
    
    static comparePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

    static generateToken(payload: payload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
    }
}