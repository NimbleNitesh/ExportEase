import { User } from "src/entities/user.entity";
import { Request, Response } from "express";
import { encrypt } from "src/utils/encrypt";
import { myDataSource } from "src/app-data-source";

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

    static async forgotPassword(_req: Request, res: Response) {
        // send email to user with reset link
        res.status(200).json({ message: 'Reset link sent to email' });
    }

    static async chagePassword(_req: Request, res: Response) {
        // change user password
        res.status(200).json({ message: 'Password changed successfully' });
    }
}