import { appDataSource } from "../data-source";
import PositionRepository from "../repositories/positionRepository";

export default class PositionSeeder {
    public async seed(): Promise<void> {
        if(!appDataSource.isInitialized){
            await appDataSource.initialize();
        }

        const positions = [
            { id: 1, name: "Point Guard", abbreviation: "PG" },
            { id: 2, name: "Shooting Guard", abbreviation: "SG" },
            { id: 3, name: "Small Forward", abbreviation: "SF" },
            { id: 4, name: "Power Forward", abbreviation: "PF" },
            { id: 5, name: "Center", abbreviation: "C" }
        ];

        const positionRepository: PositionRepository = new PositionRepository(appDataSource);
        for(const position of positions){
            await positionRepository.create(position);
        }
        console.log("Position seeding is finished.");
    }
}