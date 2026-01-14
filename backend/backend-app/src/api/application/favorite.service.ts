import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { FavoriteRepository } from "../infrastructure/repositories/favorite.repository";



@Injectable()
export class FavoriteService {
    private readonly logger = new Logger(FavoriteService.name);
    constructor(
        private readonly favoriteRepository: FavoriteRepository,
    ) {}

    async addFavorite(userID: string, moduleID: string): Promise<string> {
        const user = await this.favoriteRepository.addFavorite(userID, moduleID);
        
        //checken of module bestaat
        const moduleExists = await this.favoriteRepository.findById(moduleID);
        if (!moduleExists) throw new NotFoundException(`Module bestaat niet`);

        if (!user) {
            throw new NotFoundException(`Kon niet toevoegen aan favorieten`);
        }

        return "succes";
    }

    async removeFavorite(userID: string, moduleID: string): Promise<string> {
        const user = await this.favoriteRepository.removeFavorite(userID, moduleID);

        //checken of module bestaat
        const moduleExists = await this.favoriteRepository.findById(moduleID);
        if (!moduleExists) throw new NotFoundException(`Module bestaat niet`);

        if (!user) {
            throw new NotFoundException(`Kon niet verwijderen uit favorieten`);
        }

        return "succes";
    }

    async getFavorites(userID: string): Promise<string[]> {
        const favorites = await this.favoriteRepository.getFavorites(userID);
        if (favorites === null) {
            throw new NotFoundException(`Kon favorieten niet ophalen`);
        }
        return favorites;
    }
    
}
