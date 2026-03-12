import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

// creating an inngest client
export const inngest = new Inngest({ id: "callcruit" });

/*
App: callcruit
   ├── Function: sync-user
   ├── Function: delete-user-from-db
*/

// Sync user when Clerk user is created
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    // Extract email properly
    const email = email_addresses[0].email_address;

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });

    if (!existingUser) {
      await User.create({
        clerkId: id,
        email: email,
        name: `${first_name} ${last_name}`,
        profileImage: image_url,
      });
    }

    // Important for Inngest to mark success
    return { success: true };
  }
);

// Delete user when Clerk user is deleted
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });

    return { success: true };
  }
);

export const functions = [syncUser, deleteUserFromDB];
/*
Real Example in Your Project

Your code is doing this:

Event → clerk/user.created
        ↓
sync-user function runs
        ↓
Connect MongoDB
        ↓
Create newUser object
        ↓
Save user to database

So the event = "clerk/user.created".

*/