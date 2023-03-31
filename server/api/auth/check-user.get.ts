import mongoose from 'mongoose';
import { UserModel } from '~~/models/user';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const email: string = query.email as string;
  
  let authType = "";

  async function doesUserExist(email: string): Promise<boolean> {
    let foundResult = false;
    
    await UserModel.find({ email })
    .then((result) => {
      if (result.length > 0) {
          foundResult = true;
          authType = result[0].auth_provider;
        } else {
          foundResult = false;
        }
      })
      .catch((err) => {
        console.log(err);
      }
      );
      
      return foundResult;
    }
    
    const doesExist: boolean = await doesUserExist(email)
  
  return {
    statusCode: 200,
    body: {
      userExists: doesExist,
      auth: authType
    }
  };
});