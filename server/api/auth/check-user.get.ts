import mongoose from 'mongoose';
import { UserModel } from '~~/models/user';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const email = query.email as string;

  const doesExist = await doesUserExist(email)

  async function doesUserExist(email: string): Promise<boolean> {
    let foundResult = false;

    await UserModel.exists({ email })
      .then((result) => {
        if (result != null) {
          foundResult = true;
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

  return {
    statusCode: 200,
    body: {
      userExists: doesExist
    }
  };
});