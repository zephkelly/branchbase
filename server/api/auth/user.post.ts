import { validateQuery, validateQueryCustom } from '~~/utils/validateQuery';
import { AuthProvider, UserProfile, User, UserModel } from '~/models/user';
import { pool } from '~/server/postgres';
import bcrypt from 'bcrypt';

export default eventHandler(async (event: any) => {
  const body = await readBody(event);

  const { email, password } = body as User;
  let { auth_provider } = body as User;
  const { display_name } = body as UserProfile;
  let { avatar_url } = body as UserProfile;

  if (validateQuery(email, password, auth_provider, display_name, ) == false) {
    return {
      statusCode: 400,
      body: 'Invalid query.'
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

  if (validatePassword(password) == false) {
    return {
      statusCode: 400,
      body: 'Invalid password.'
    }
  }

  if (await UserModel.exists({ email })) {
    return {
      statusCode: 400,
      body: 'User already exists.'
    }
  }

  let newUserModel: any = null

  if (avatar_url == null || avatar_url == undefined || avatar_url == '') {
    avatar_url = 'https://breezebase.net/assets/images/default-avatar.png';
  }

  if (checkAuthProvider(auth_provider) == false) {
    auth_provider = AuthProvider.email;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    newUserModel = new UserModel({
      email: email,
      display_name: display_name,
      password: hashedPassword,
      auth_provider: 'email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
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

    newUserModel = new UserModel({
      email: email,
      display_name: display_name,
      auth_provider: auth_provider,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  await newUserModel.save();
  
  await pool.query(
    'INSERT INTO user_profiles (email, display_name, bio, avatar_url) VALUES ($1, $2, $3, $4)',
    [ email, display_name, '', avatar_url ]
  );

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
  if (password.length < 8) {
    return false;
  }

  return true;
}