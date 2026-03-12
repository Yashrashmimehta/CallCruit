import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

//creating an inngest client for your application. using the app id:callcruit
export const inngest = new Inngest({ id: "callcruit" });
/*
App: callcruit
   ├── Function: sync-user
   ├── Function: send-email
   ├── Function: generate-report
*/

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    if (!existingUser) {
  await User.create({
    clerkId: event.data.id,
    email,
    name: event.data.first_name,
  });
}

    await User.create(newUser);
  }
);

 const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
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