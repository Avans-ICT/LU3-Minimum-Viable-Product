import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { User } from "../infrastructure/schemas/user.schema";
import { FavoriteRepository } from "../infrastructure/repositories/favorite.repository";



@Injectable()
export class FavoriteService {
    private readonly logger = new Logger(FavoriteService.name);
    constructor(private readonly FavoriteRepository: FavoriteRepository) { }

    async addFavorite(userID: string, moduleID: string): Promise<User> {
        const user = await this.FavoriteRepository.addFavorite(userID, moduleID);
        
        if (!user) {
        throw new NotFoundException(`User with ID ${userID} not found`);
        }

        return user;
    }

    async removeFavorite(userID: string, moduleID: string): Promise<User | any> {
        const user = await this.FavoriteRepository.removeFavorite(userID, moduleID);

        if (!user) {
        throw new NotFoundException(`Could not remove ${moduleID} from ${userID}`);
        }

        return user;


    }

    async getFavorites(userID: string): Promise<string[]> {
        const favorites = await this.FavoriteRepository.getFavorites(userID);
        if (favorites === null) {
            throw new NotFoundException(`User with ID ${userID} not found`);
        }
        return favorites;
    }
    
}
