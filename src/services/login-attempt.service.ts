import LoginAttempt from "../models/Login-Attempt";
import { env } from "../configs/env";

export const checkLoginBlocked = async (ip: string, username: string) => {
  const loginAttempt = await LoginAttempt.findOne({
    ip,
    username,
  });

  if (!loginAttempt) {
    return false;
  }

  const now = new Date();

  if (loginAttempt.blockedUntil && loginAttempt.blockedUntil > now) {
    return true;
  }

  if (loginAttempt.blockedUntil && loginAttempt.blockedUntil <= now) {
    loginAttempt.attempts = 0;
    loginAttempt.blockedUntil = undefined;

    await loginAttempt.save();
  }

  return false;
};

export const recordFailedLogin = async (ip: string, username: string) => {
  const loginAttempt = await LoginAttempt.findOneAndUpdate(
    {
      ip,
      username,
    },
    {
      $inc: {
        attempts: 1,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  if (loginAttempt.attempts >= env.LOGIN_MAX_ATTEMPTS) {
    loginAttempt.blockedUntil = new Date(
      Date.now() + env.LOGIN_BLOCK_DURATION_MINUTES * 60 * 1000,
    );

    await loginAttempt.save();
  }
  return loginAttempt;
};

export const resetLoginAttempt = async (ip: string, username: string) => {
  await LoginAttempt.deleteOne({
    ip,
    username,
  });
};
