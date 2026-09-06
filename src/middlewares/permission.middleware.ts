export const authorize = (...permissions: string[]) => {
  return (req: any, res: any, next: any) => {
    try {
      const userPermissions = req.user?.permissions;

      if (!userPermissions) {
        return res.status(403).json({
          message: "Permissions Not Found",
        });
      }

      const hasPermission = permissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access Denied",
        });
      }

      next();
    } catch (error) {
      console.error("Permission Authorization Error:", error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
  };
};
