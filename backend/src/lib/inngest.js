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

    if (!existingUser) { // Only create a new user if one doesn't already exist
      const newUser = {
        clerkId: id,
        email: email,
        name: `${first_name} ${last_name}`,
        profileImage: image_url,
      };

      await User.create(newUser);
      
      //Add stream user as well
      await upsertStreamUser({
        id: newUser.clerkId.toString(), // Use Clerk ID as Stream user ID for consistency
        name: newUser.name,
        image: newUser.profileImage,
        //why email is not 
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
    //the below line ensures that the user is deleted from MongoDB based on their Clerk ID, which is stored in the `clerkId` field of the User model. This way, when a user is deleted in Clerk, we can find and remove the corresponding user in our MongoDB database using that unique identifier.
    await User.deleteOne({ clerkId: id });// Delete the user from MongoDB and clerk?
  
    await deleteStreamUser(id.toString()); // Delete the corresponding Stream user
    //why .toString() is used here
    //ans .toString() is used to ensure that the ID is in string format, which is necessary because Stream user IDs are expected to be strings. Since the Clerk ID might be a different type (like an ObjectId or a number), converting it to a string ensures consistency when interacting with the Stream API.
    //but where is it written that stream user ids should be string
    //

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