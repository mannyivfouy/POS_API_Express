export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    try {
      const userRole = req.user?.roleId?.name;
      if (!userRole) {
        return res.status(403).json({ message: "Role Not Found" });
      }

      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (err: any) {
      return res.status(500).json({ message: "Server Error" });
    }
  };
};
