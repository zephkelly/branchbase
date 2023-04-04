import { validateQuery, validateQueryCustom } from '~~/utils/validateQuery';
import { pool } from '~/server/postgres';
import bcrypt from 'bcrypt';

import { AuthProvider, UserMetadata, Users, user_metadata, user_stats } from '~/models/user';

export default eventHandler(async (event: any) => {
  const body = await readBody(event);

  const { email, password } = body as Users;
  let { auth_provider } = body as Users;

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
  else if (validateQuery(email, auth_provider, display_name) == false) {
    return {
      statusCode: 400,
      body: 'We couldn\'t validate your info.'
    }
  }
  else if (validateQueryCustom(display_name, 1, 25) == false) {
    return {
      statusCode: 400,
      body: 'Invalid display name. Greater than 25 characters.'
    }
  }
  else if (validateEmail(email) == false) {
    return {
      statusCode: 400,
      body: 'Invalid email.'
    }
  }
 
  const userData = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userData.rowCount > 0) {
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

  try {
    await pool.query('BEGIN');

    //User
    const userResult = await pool.query(
      `INSERT INTO users (
        email,
        password,
        auth_provider
      ) VALUES ($1, $2, $3) RETURNING id`,
      [email, hashedPassword, auth_provider]
    );

    //Grab the user id
    const user_id: Number = userResult.rows[0].id;

    //User metadata
    const metadataResult = await pool.query(
      `INSERT INTO user_metadata (
        user_id,
        display_name,
        avatar_url
      ) VALUES ($1, $2, $3)`,
      [ user_id, display_name, avatar_url ]
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