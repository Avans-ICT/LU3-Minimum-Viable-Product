import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Profile } from 'src/api/domain/entities/profile';
import { UserEntity } from 'src/api/domain/entities/user';
import { ProfileSchemaClass } from '../schemas/profile.schema';
@Injectable()
export class AuthRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    //user aanmaken
    async createUser(user: Partial<User>): Promise<User> {
        return this.userModel.create({
            email: user.email,
            password: user.password,
            profile: {
                firstName: user.profile?.firstName ?? '',
                lastName: user.profile?.lastName ?? '',
                interests: '',
                studycredits: 0,
                location: '',
                level: '',
            },
        });
    }

    //user per email vinden(login)
    async findByEmail(email: string): Promise<UserEntity | null> {
        const userDoc = await this.userModel.findOne({ email }).lean();
        if (!userDoc) return null;

        return this.toEntity(userDoc);
    }

    //Refreshtoken van user updaten
    async updateRefreshToken(userId: string, refreshToken: string | null) {
        return this.userModel.updateOne(
            { _id: userId },
            { refreshToken },
        );
    }

    //user vinden per id
    async findById(id: string): Promise<UserEntity | null> {
        const userDoc = await this.userModel.findById(id).lean();
        if (!userDoc) return null;

        return this.toEntity(userDoc);
    }

    //profile vinden per id
    async getProfileByUserId(userId: string): Promise<Profile | null> {
        const user = await this.userModel
            .findById(userId)
            .select('profile')
            .lean();

        if (!user?.profile) return null;

        const p = user.profile;

        return new Profile(
            p.firstName,
            p.lastName,
            p.interests,
            p.studycredits,
            p.location,
            p.level,
        );
    }
    
    async changeProfile(
        profileData: Partial<ProfileSchemaClass>,
        userId: string
    ): Promise<{ matched: boolean }> {
        // $set fields per veld, zodat we het hele profile object niet overschrijven
        const setFields: Record<string, any> = {};

        if (profileData.firstName !== undefined) setFields['profile.firstName'] = profileData.firstName;
        if (profileData.lastName !== undefined) setFields['profile.lastName'] = profileData.lastName;
        if (profileData.interests !== undefined) setFields['profile.interests'] = profileData.interests;
        if (profileData.studycredits !== undefined) setFields['profile.studycredits'] = profileData.studycredits;
        if (profileData.location !== undefined) setFields['profile.location'] = profileData.location;
        if (profileData.level !== undefined) setFields['profile.level'] = profileData.level;

        // niks om te updaten
        if (Object.keys(setFields).length === 0) {
            return { matched: false };
        }

        // update de user
        const result = await this.userModel.updateOne(
            { _id: userId },
            { $set: setFields },
        );

        return { matched: result.matchedCount > 0 };
    }
 
    private toEntity(userDoc: any): UserEntity {
        return new UserEntity(
            userDoc._id.toString(),
            userDoc.email,
            userDoc.password,
            new Profile(
                userDoc.profile.firstName,
                userDoc.profile.lastName,
                userDoc.profile.interests,
                userDoc.profile.studycredits,
                userDoc.profile.location,
                userDoc.profile.level,
            ),
            userDoc.refreshToken,
        );
    }
}