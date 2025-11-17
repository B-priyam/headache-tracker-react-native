import jwt from "jsonwebtoken";

export const getUserUsingJwt = async (token: string) => {
  const accessToken = token.split(" ")[1];
  const user = (await jwt.decode(accessToken)) as { id: string };
  return user.id;
};
