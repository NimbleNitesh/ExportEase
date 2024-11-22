import { User } from "../entities/user.entity";
import { Request, Response } from "express";
import { encrypt } from "../utils/encrypt";
import myDataSource  from "../app-data-source";
import { v4 } from 'uuid';
import { sendMail } from "../utils/sendMail";

export class UserController {
    static async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        const encryptPassword = await encrypt.encryptPassword(password);
        const user = new User();
        user.email = email;
        user.username = username;
        user.password = encryptPassword;

        try {
            await myDataSource.getRepository(User).save(user);
            const token = encrypt.generateToken({ id: user.id});

            res.status(200).json({ message: 'User registered successfully', token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { emailOrUsername, password } = req.body;
            if (!emailOrUsername || !password) {
                res.status(400).json({ message: 'Email/Username and password are required' });
            }

            const userRepository = myDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: [
                  { username: emailOrUsername },
                  { email: emailOrUsername },
                ],
            });

            if (!user || user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const isPasswordValid = encrypt.comparePassword(password, user.password);

            if (!isPasswordValid) {
                res.status(404).json({ message: 'Invalid password' });
                return;
            }

            const token = encrypt.generateToken({ id: user.id });
            res.status(200).json({ message: 'Login successful', token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async logout(_req: Request, res: Response) {
        try {
            res.clearCookie('token', { httpOnly: true, secure: true });
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        // send email to user with reset link
        const { email } = req.body;
        try {
            const user = await myDataSource.getRepository(User).findOne({ where: { email } });
            if(!user || user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const resetToken = v4();
            await req.redis.set(process.env.FORGOT_PASSWORD_PREFIX + resetToken, user.id, { EX: 60 * 5 });
            await sendMail(
                email,
                `<p>
                Click the following link to verify your email: 
                <a href="http://localhost:${process.env.PORT}/change-password/${resetToken}"> Link </a>.
                Link will be valid for 5 minutes.
                </p>`
            )

            res.status(200).json({ message: 'Reset link sent to email' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async chagePassword(req: Request, res: Response) {
        // change user password
        const { token, newPassword } = req.body;
        try {
            const userId = await req.redis.get(process.env.FORGOT_PASSWORD_PREFIX + token);
            if (!userId || userId === null) {
                res.status(400).json({ message: 'Invalid or expired token' });
                return;
            }

            const user = await myDataSource.getRepository(User).findOne( { where: { id: userId } } );
            if (!user || user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const encryptPassword = await encrypt.encryptPassword(newPassword);
            user.password = encryptPassword;
            await myDataSource.getRepository(User).save(user);

            await req.redis.del(process.env.FORGOT_PASSWORD_PREFIX + token);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Password changed successfully' });
    }
}