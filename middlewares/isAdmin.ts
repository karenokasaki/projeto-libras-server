//todo add type for user

export async function isAdmin(req: any, res: any, next: any) {
  try {
    if (req.currentUser.role !== "ADMIN") {
      return res.status(401).json({ msg: "User unauthorized." });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
