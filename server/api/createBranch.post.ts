// import { mongoose } from '~~/server/mongo';
// import { pool } from '~~/server/postgres';
// require('dotenv').config();

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);
//   const { name, description } = await JSON.parse(body);

//   try {
//     if (await !doesTableExist(name)) {
//       console.error("Branch already exists.");
//       throw new Error("Branch already exists.");
//     }

//     if (await createBranchMeta(name, description)) {
//       console.error("Branch meta creation failed.");
//       throw new Error("Branch meta creation failed.");
//     }

//     if (await createBranchCollection(name)) {
//       console.error("Branch collection creation failed.");
//       throw new Error("Branch collection creation failed.");
//     }

//     await insertReferenceToBranchCollection(name, name);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Branch created successfully." }),
//     };
//   }
//   catch (err) {
//     console.error(err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Branch creation failed." + err }),
//     };
//   }
// });

// async function doesTableExist(tableName: string) {
//   return await pool.query(
//     'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)',
//     [tableName]
//   );
// }

// async function createBranchMeta(name: string, description: string) {
//   return await pool.query(
//     'INSERT INTO branches (name, description) VALUES ($1, $2) RETURNING *',
//     [name, description]
//   );
// }

// async function createBranchCollection(name: string) {
//   return await mongoose.createConnection(
//       `${process.env.MONGO_CONNECTION + name}`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//   );
// }

// async function insertReferenceToBranchCollection(name: string, collection: string) {
//   return await pool.query(
//     'UPDATE branches SET posts_collection = $1 WHERE id = $2',
//     [collection, name]
//   );
// }