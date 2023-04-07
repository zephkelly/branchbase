import { validateQuery, validateQueryCustom } from '~~/utils/validateQuery';
import { pool } from '~/server/postgres';
import bcrypt from 'bcrypt';

import { AuthProvider, UserMetadata, Users, user_metadata, user_stats } from '~/models/user';

export default eventHandler(async (event: any) => {
  const body = await readBody(event);

  const user: Users = {
    email: body.email,
    password: body.password,
    auth_provider: body.auth_provider,
    verified: false,
  }

  const userMetadata: UserMetadata = {
    display_name: body.display_name,
    avatar_url: body.avatar_url,
    bio: '',
    user_id: 0,
  }

  //--------------------Validation--------------------
  //
  //Input checks
  if (!user.password) {
    if (validatePassword(user.password)) {
      return {
        statusCode: 400,
        body: 'Password is too short.'
      }
    }
  }
  else if (validateQuery(user.email, user.auth_provider, userMetadata.display_name) == false) {
    return {
      statusCode: 400,
      body: 'We couldn\'t validate your info.'
    }
  }
  else if (validateQueryCustom(userMetadata.display_name, 1, 25) == false) {
    return {
      statusCode: 400,
      body: 'Invalid display name. Greater than 25 characters.'
    }
  }
  else if (validateEmail(user.email) == false) {
    return {
      statusCode: 400,
      body: 'Invalid email.'
    }
  }
 
  //Does user exist already in db?
  const userData = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);

  if (userData.rowCount > 0) {
    return {
      statusCode: 400,
      body: 'User already exists.'
    }
  }

  //Set default avatar if null
  if (!userMetadata.avatar_url) {
    userMetadata.avatar_url = '';
  }

  //Set auth provider and hash password if it's email
  let hashedPassword: string | null = null;

  switch (user.auth_provider) {
    case 'google':
      user.auth_provider = AuthProvider.google;
      break;
    case 'github':
      user.auth_provider = AuthProvider.github;
      break;
    case 'discord':
      user.auth_provider = AuthProvider.discord;
      break;
    default:
      user.auth_provider = AuthProvider.email;

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(user.password, salt);
      break;
  }

  //--------------------Create User--------------------
  //
  await pool.query('BEGIN');

  try {
    //User
    const userResult = await pool.query(
      `INSERT INTO users (
        email,
        password,
        auth_provider
      ) VALUES ($1, $2, $3) RETURNING id`,
      [user.email, hashedPassword, user.auth_provider]
    );

    const user_id: Number = userResult.rows[0].id;

    //User metadata
    const metadataResult = await pool.query( 
      `INSERT INTO user_metadata (
        user_id,
        display_name,
        avatar_url
      ) VALUES ($1, $2, $3)`,
      [ user_id, userMetadata.display_name, userMetadata.avatar_url ]
    );

    //User stats
    await pool.query(
      `INSERT INTO user_stats (
        user_id
      ) VALUES ($1)`,
      [user_id]
    );

  }
  catch (err) {
    await pool.query('ROLLBACK');

    console.log(err);
    return {
      statusCode: 500,
      body: 'Something went wrong inserting user stats and metadata.'
    };
  }

  await pool.query('COMMIT');

  return {
    statusCode: 200,
    body: 'User created successfully.'
  }
});

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