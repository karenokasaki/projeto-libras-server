import AdminModel from "../models/admin.model";
import UserModel from "../models/user.model";

export default async function attachCurrentUser(req: any, res: any, next: any) {
  try {
    const userData = req.auth;

    if (userData.type === "USER") {
      const user = await UserModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      );

      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      req.currentUser = user;
    }

    if (userData.type === "ADMIN") {
      const admin = await AdminModel.findOne(
        { _id: userData._id },
        { passwordHash: 0 }
      );

      if (!admin) {
        return res.status(404).json({ msg: "Admin not found." });
      }
      req.currentUser = admin;
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
