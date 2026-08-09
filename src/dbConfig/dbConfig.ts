import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_UR!)
        const connection = mongoose.connection

        connection.on('conected', () => {
            console.log("MongoDB is Conected");
            
        })

        connection.on('error', (err) => {
            console.log("MongoDB is not Conected " + err);
            process.exit()
        })
         
    } catch (error) {
        console.log("Something went wrong in connection to DB");
        console.log(error);
        
        
    }
}