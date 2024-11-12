import PositionSeeder from "./src/seeders/positionSeeder";

const seed = async() => {
    const positionSeeder = new PositionSeeder();
    await positionSeeder.seed();
}

seed().then(() => {
    console.log("Seeding completed successfully.");
}).catch((error) => {
    console.error("Seeding failed:", error);
})