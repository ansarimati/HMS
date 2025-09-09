// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the mongoDb URI in .env file");
// }

// /**
//  * Maintain a cached connection across hot reloads in development
//  * to prevent multiple connections to the database.
//  */

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function dbConnect () {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//     useUnifiedTopology: true,
//     })
//       .then((mongoose) => {
//         console.log("MongoDb Connected Successfully");
//         return mongoose
//       })
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// // const isConnected = false;

// // async function dbConnect(params) {
  
// //   if (isConnected) {
// //       return;
// //     }

// //   try {
// //     const db = await mongoose.connect(MONGODB_URI);
// //     isConnected = db.connection[0].readyState;
// //     console.log("Connecteddd");
// //   } catch (error) {
// //     console.log("Connection Faileddd", error);
// //     throw error;
// //   }
// // }

// // await dbConnect();
// export default dbConnect;



import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your .env file");
}

// Global cache to prevent multiple connections during hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("cached", cached);
  if (cached.conn) {
    console.log("found cached ")
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("No Promise found");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // Disable mongoose buffering
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
