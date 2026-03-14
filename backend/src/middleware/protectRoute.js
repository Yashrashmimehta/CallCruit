import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
//   requireAuth({signInUrl: "/sign-in"}),  This middleware checks if the user is authenticated using Clerk. If not, it redirects them to the sign-in page. If the user is authenticated, it adds an `auth` object to the request (`req`) which contains the user's authentication information, including their user ID.
requireAuth(), // This middleware checks if the user is authenticated using Clerk. If not, it returns a 401 Unauthorized response. If the user is authenticated, it adds an `auth` object to the request (`req`) which contains the user's authentication information, including their user ID.
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      const user = await User.findOne({ clerkId });

      if (!user) return res.status(404).json({ message: "User not found" });

      // attach user to req
      req.user = user;//make me understand in simple english what is happening in the above line of code
      //ans: The line `req.user = user;` is attaching the user object that we found in the database to the request object (`req`). This means that in any route handler that comes after this middleware, we can access the authenticated user's information through `req.user`. It's a way to make the user's data available throughout the request-response cycle after we've verified their identity and fetched their details from the database.

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];