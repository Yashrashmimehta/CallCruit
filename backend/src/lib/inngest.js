import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
//import { deleteStreamUser, upsertStreamUser } from "./stream.js";

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

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
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