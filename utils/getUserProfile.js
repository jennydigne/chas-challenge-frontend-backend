import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserProfile = async (uid) => {
  try {
    const profileRef = doc(db, "profiles", uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return profileSnap.data();
    } else {
      console.log("No profile found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};