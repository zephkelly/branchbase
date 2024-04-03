import { e as eventHandler, r as readBody, p as pool } from '../user/get-id.get.mjs';
import { v as validateQueryLength, a as validateQueryCustom } from '../../../_/validation.mjs';
import bcrypt from 'bcrypt';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'pg';
import 'dotenv';
import 'sharp';
import 'node:fs';
import 'node:url';

var AuthProvider = /* @__PURE__ */ ((AuthProvider2) => {
  AuthProvider2["email"] = "email";
  AuthProvider2["discord"] = "discord";
  AuthProvider2["github"] = "github";
  AuthProvider2["google"] = "google";
  return AuthProvider2;
})(AuthProvider || {});

const user_post = eventHandler(async (event) => {
  const body = await readBody(event);
  const user = {
    email: body.email,
    password: body.password,
    auth_provider: body.auth_provider,
    verified: false
  };
  const userMetadata = {
    display_name: body.display_name,
    avatar_url: body.avatar_url,
    bio: "",
    user_id: 0
  };
  if (!user.password && user.password != void 0) {
    if (validatePassword(user.password)) {
      return {
        statusCode: 400,
        body: "Password is too short."
      };
    }
  } else if (validateQueryLength(user.email, user.auth_provider, userMetadata.display_name) == false) {
    return {
      statusCode: 400,
      body: "We couldn't validate your info."
    };
  } else if (validateQueryCustom(userMetadata.display_name, 1, 25) == false) {
    return {
      statusCode: 400,
      body: "Invalid display name. Greater than 25 characters."
    };
  } else if (validateEmail(user.email) == false) {
    return {
      statusCode: 400,
      body: "Invalid email."
    };
  }
  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [user.email]);
  if (userData.rowCount > 0) {
    return {
      statusCode: 400,
      body: "User already exists."
    };
  }
  if (!userMetadata.avatar_url) {
    userMetadata.avatar_url = "";
  }
  let hashedPassword = null;
  switch (user.auth_provider) {
    case "google":
      user.auth_provider = AuthProvider.google;
      break;
    case "github":
      user.auth_provider = AuthProvider.github;
      break;
    case "discord":
      user.auth_provider = AuthProvider.discord;
      break;
    default:
      user.auth_provider = AuthProvider.email;
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(user.password, salt);
      break;
  }
  await pool.query("BEGIN");
  try {
    const userResult = await pool.query(
      `INSERT INTO users (
        email,
        password,
        auth_provider
      ) VALUES ($1, $2, $3) RETURNING id`,
      [user.email, hashedPassword, user.auth_provider]
    );
    const user_id = userResult.rows[0].id;
    const metadataResult = await pool.query(
      `INSERT INTO user_metadata (
        user_id,
        display_name,
        avatar_url
      ) VALUES ($1, $2, $3)`,
      [user_id, userMetadata.display_name, userMetadata.avatar_url]
    );
    await pool.query(
      `INSERT INTO user_stats (
        user_id
      ) VALUES ($1)`,
      [user_id]
    );
  } catch (err) {
    await pool.query("ROLLBACK");
    console.log(err);
    return {
      statusCode: 500,
      body: "Something went wrong inserting user stats and metadata."
    };
  }
  await pool.query("COMMIT");
  return {
    statusCode: 200,
    body: "User created successfully."
  };
});
function validateEmail(email) {
  const re = /@/;
  return re.test(email);
}
function validatePassword(password) {
  if (password.length > 8) {
    return false;
  }
  return true;
}

export { user_post as default };
//# sourceMappingURL=user.post.mjs.map
