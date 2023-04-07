//-----------------Subscriptions------------------
//
export interface BranchSubscriptions {
  user_id: number;
  branch_id: number;
  //PRIMARY KEY (user_id, branch_id)
}

//-----------------SQL TABLE------------------
// CREATE TABLE branch_subscriptions (
//   user_id BIGINT REFERENCES users(id),
//   branch_id BIGINT REFERENCES branches(id),
//   PRIMARY KEY (user_id, branch_id)
// );

//-----------------Insert statement------------------
// INSERT INTO subscriptions (user_id, branch_id) VALUES (123, 456);

//-----------------Select statement------------------
// SELECT b.*
// FROM branches b
// JOIN subscriptions s ON b.id = s.branch_id
// WHERE s.user_id = 123;