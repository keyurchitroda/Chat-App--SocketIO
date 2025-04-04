import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const getAllGroupService = () => {
  return gauestAxiosInstance.get("/group");
};

export const createGroupService = (body: any) => {
  return gauestAxiosInstance.post("/group", body);
};
