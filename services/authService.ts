import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const signinService = (data: any) => {
  return gauestAxiosInstance.post("/auth/signin", data);
};

export const signupService = (data: any) => {
  return gauestAxiosInstance.post("/auth/signup", data);
};

export const signoutService = () => {
  return gauestAxiosInstance.get("/auth/logout");
};

export const getUserListService = () => {
  return gauestAxiosInstance.get("/auth/signup");
};
