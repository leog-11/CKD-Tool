import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs_WFHQL6icCzIbj-JE4A2-lFOK8BKJH4",
  authDomain: "ckd-project-d1fed.firebaseapp.com",
  projectId: "ckd-project-d1fed",
  storageBucket: "ckd-project-d1fed.firebasestorage.app",
  messagingSenderId: "873512387407",
  appId: "1:873512387407:web:09b4ec9630a8878c9dfb3a",
  measurementId: "G-HF9L2E5888",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signUp = async (
  identifier: string,
  password: string,
  userType: "Patient" | "Clinician",
  firstName?: string,
  lastName?: string
) => {
  try {
    // Create a custom email using identifier and type
    const emailIdentifier = `${identifier}-${userType.toLowerCase()}@localid.system`;

    // Create user in database
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailIdentifier,
      password
    );
    const user = userCredential.user;

    // Store user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      identifier,
      userType,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const login = async (
  identifier: string,
  password: string,
  userType: "Patient" | "Clinician"
) => {
  try {
    // create a custom email using the identifier and user type
    const emailIdentifier = `${identifier}-${userType.toLowerCase()}@localid.system`;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailIdentifier,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const saveEGFRResult = async (
  userId: string,
  result: {
    value: number;
    stage: string;
    date?: string;
  }
) => {
  try {
    // check db is correctly initialized
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    // Create a reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Create a reference to the egfrResults subcollection
    const resultsRef = collection(userDocRef, "egfrResults");

    // add document to the subcollection
    const docRef = await addDoc(resultsRef, {
      value: result.value,
      stage: result.stage,
      date: result.date || new Date().toISOString(),
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error("Failed to save eGFR result");
  }
};
export const requestPasswordReset = async (
  identifier: string,
  userType: "Patient" | "Clinician"
) => {
  try {
    const resetCode = Math.random().toString().slice(2, 8);

    // Store reset request in database
    await setDoc(doc(db, "passwordResets", identifier), {
      identifier,
      userType,
      resetCode,
      createdAt: new Date(),
      status: "pending",
    });

    return resetCode;
  } catch (error: any) {
    throw new Error("Password reset request failed");
  }
};

export const verifyPasswordResetRequest = async (
  identifier: string,
  resetCode: string
) => {
  try {
    // verify the reset code
    const resetDoc = await getDoc(doc(db, "passwordResets", identifier));

    if (!resetDoc.exists() || resetDoc.data().resetCode !== resetCode) {
      throw new Error("Invalid reset code");
    }

    // Update the status to verified
    await updateDoc(doc(db, "passwordResets", identifier), {
      status: "verified",
    });

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const completePasswordReset = async (
  identifier: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    const resetDoc = await getDoc(doc(db, "passwordResets", identifier));

    if (
      !resetDoc.exists() ||
      resetDoc.data().resetCode !== resetCode ||
      resetDoc.data().status !== "verified"
    ) {
      throw new Error("Invalid or unverified reset request");
    }

    // find the user in database
    const userQuery = query(
      collection(db, "users"),
      where("identifier", "==", identifier)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    // update the reset status
    await updateDoc(doc(db, "passwordResets", identifier), {
      status: "completed",
    });

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
