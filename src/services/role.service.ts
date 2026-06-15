import Role from "../models/Role";

export const createRole = async (data: any) => {
  const existingRole = await Role.findOne({name: data.name});
  if(existingRole){
    throw new Error("Role Already Exists");
  }

  return await Role.create(data);
}
