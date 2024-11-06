import { appDataSource } from "./src/data-source";
import app from "./src/app";

const PORT = parseInt(process.env.API_PORT || '3001');

appDataSource.initialize()
    .then(() =>{
        console.log("Data Source has been initialized");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });