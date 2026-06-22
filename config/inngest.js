import { Inngest } from "inngest";
import dbConnect from "@/config/db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }], // ✅ triggers (plural)
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data; // ✅ image_url
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url, // ✅ ab match karega
    };
    await dbConnect();
    await User.create(userData);
  }
);

export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }], // ✅ triggers (plural)
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data; // ✅ image_url
    const userData = {
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
    };
    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
  }
);

export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }], // ✅ triggers (plural)
  },
  async ({ event }) => {
    const { id } = event.data;
    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);