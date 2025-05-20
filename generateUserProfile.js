//Skapar eller uppdaterar användarens profil i databasen utifrån deras onboarding-svar

import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const generateProfileFromAnswers = async (uid) => {
  try {

    const answersRef = collection(db, "profiles", uid, "onboardingAnswers");
    const snapshot = await getDocs(answersRef);

    const profile = {
      challenges: [],
      preferences: [],
      reminderTimes: [],
      calendarSync: false,
    };

    snapshot.forEach((docSnap) => {
      const { question, answer } = docSnap.data();

      if (question.includes("main challenges")) {
        profile.challenges = answer;
      } else if (question.includes("helps you")) {
        profile.preferences = answer;
      } else if (question.includes("reminder notifications")) {
        profile.reminderTimes = answer;
      } else if (question.includes("calendar")) {
        profile.calendarSync = answer.includes("Sync");
      }
    });

    const profileRef = doc(db, "profiles", uid);
    await setDoc(profileRef, profile); 

    console.log("Profile saved:", profile);
  } catch (error) {
    console.error("Profile could not be saved:", error);
  }
};

