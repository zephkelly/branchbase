import { validateQuery, validateQueryCustom } from '~~/utils/validateQuery';
import { pool } from '~/server/postgres';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { AuthProvider, UserMetadata, User, UserModel, user_metadata, user_stats } from '~/models/user';

export default eventHandler(async (event: any) => {
  const body = await readBody(event);

  const { email, password } = body as User;
  let { auth_provider } = body as User;
  const { display_name } = body as UserMetadata;
  let { avatar_url } = body as UserMetadata;

  if (password != null || password != undefined) {
    if (validatePassword(password)) {
      return {
        statusCode: 400,
        body: 'Password is too short.'
      }
    }
  }

  if (validateQuery(email, auth_provider, display_name) == false) {
    return {
      statusCode: 400,
      body: 'We couldn\'t validate your info.'
    }
  }

  if (validateQueryCustom(display_name, 1, 25) == false) {
    return {
      statusCode: 400,
      body: 'Invalid display name. Greater than 25 characters.'
    }
  }

  if (validateEmail(email) == false) {
    return {
      statusCode: 400,
      body: 'Invalid email.'
    }
  }

  if (await UserModel.exists({ email })) {
    return {
      statusCode: 400,
      body: 'User already exists.'
    }
  }

  
  if (!avatar_url) {
    avatar_url = 'https://breezebase.net/assets/images/default-avatar.png';
  }

  let hashedPassword: string | null = null;

  if (checkAuthProvider(auth_provider) == false) {
    auth_provider = AuthProvider.email;

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }
  else {
    if (auth_provider === 'google') {
      auth_provider = AuthProvider.google;
    }
    else if (auth_provider === 'github') {
      auth_provider = AuthProvider.github;
    }
    else if (auth_provider === 'discord') {
      auth_provider = AuthProvider.discord;
    }
  }
  
  const transaction = await mongoose.startSession();

  try {
    await transaction.startTransaction();
    await pool.query('BEGIN');

    //User metadata
    const metadataResult = await pool.query(
      `INSERT INTO ${user_metadata} (
        email,
        display_name,
        avatar_url
        ) VALUES ($1, $2, $3) RETURNING id`,
      [ email, display_name, avatar_url ]
    );

    //Grab the user id
    const user_id: Number = metadataResult.rows[0].id;

    //User stats
    const statsResult = await pool.query(
      `INSERT INTO ${user_stats} (
        id,
        view_count,
        post_count,
        comment_count,
        like_count,
        dislike_count
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, 0, 0, 0, 0, 0]
    );

    //Create user model
    const newUserModel = await UserModel.create({
      _id: user_id,
      email: email,
      password: hashedPassword,
      auth_provider: auth_provider
    });

    await newUserModel.save();
  }
  catch (err) {
    await pool.query('ROLLBACK');
    await transaction.abortTransaction();

    console.log(err);
    return {
      statusCode: 500,
      body: 'Something went wrong inserting user stats and metadata.'
    };
  }

  await pool.query('COMMIT');
  await transaction.commitTransaction();

  return {
    statusCode: 200,
    body: 'User created successfully.'
  }
});

function checkAuthProvider(authProvider: string) {
  if (authProvider === 'email' || authProvider === AuthProvider.email || authProvider === '' || authProvider === null || authProvider === undefined) {
    return false;
  }
  
  return true;
}

function validateEmail(email: string) {
  const re = /@/;
  return re.test(email);
}

function validatePassword(password: string) {
  if (password.length > 8) {
    return false;
  }

  return true;
}