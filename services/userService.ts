import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const getAllUserService = () => {
  return gauestAxiosInstance.get("/auth/signup");
};
