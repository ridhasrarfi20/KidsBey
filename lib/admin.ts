import { auth } from "@clerk/nextjs";


const adminIds = ["user_2x3JDe07ygiOoV1xUq4l9IRfAcN",];

export const getIsAdmin = async() => {
  const { userId } = await auth();

  

  if (!userId) return false;

  return adminIds.indexOf(userId)!==-1;
};
