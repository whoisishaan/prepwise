"use server";

import { db, auth } from "@/firebase/admin";
import { User } from "firebase/auth";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
type SignUpParams = {
    uid: string;
    name: string;
    email: string;
  };
  
  type SignInParams = {
    email: string;
    idToken: string;
  };

export async function signUp(params: SignUpParams){
    const {uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exists. Please sig in instead'
            }
        } 

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully! Please sign in.'
        }

    } catch(err){
        console.error('Error creating a user', err);

        if ((err as { code?: string }).code === 'auth/email-already-exists') {
            return{
                success:false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}


export async function signIn(params: SignInParams){
    const {email, idToken} = params; 

    
    
    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User not found. Create an account instead.'

            };
        }

        await setSessionCookie(idToken);
       // const idToken = await auth.createCustomToken(userRecord.uid);
       
       return {
        success: true,
        message: 'Logged in successfully',
      };


    } catch(e){
        console.log(e);

        return {
            success: false,
            message : 'Failed to log in to account.'
        }
    }
}



export async function getCurrentUser(): Promise<User | null>{
   const cookieStore = await cookies();
   const sessionCookie = cookieStore.get('session') ?.value;
   
   if(!sessionCookie) return null;

   try{
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if(!userRecord.exists) return null;

    return {
        ...userRecord.data(),
        id: userRecord.id,
    } as  User;

   } catch(e){
    console.log( e);
    return null;
   }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user; 
}