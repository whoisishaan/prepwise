"use client";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner";
import { z } from "zod"

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import FormField from "./FormField";

// import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

// Define the FormType type
type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type : FormType) => {
  return z.object ({
    name: type ==='sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6).max(15),
  })
}


const AuthForm = ({type}:{type: FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type) as z.ZodObject<any>;
     
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type==='sign-up'){
        const {name, email, password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        
        const result = await signUp({
          uid: userCredentials.user.uid,
          name,
          email,
        })
        if(!result ?.success){
          toast.error(result.message)
          return;
        } else{

        toast.success('Account created successfully! Please sign in.')
        router.push('/sign-in')
        }
      } 
      
      else {
      const {email, password} = values;
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredentials.user.getIdToken(true);
      
      await signIn({
        email, idToken
      })
      
      if(!idToken){
        toast.error('Sign in failed')
        return;
      }

  

        toast.success('Sign in successful!')
        router.push('/')
      }
    }

    catch(error){
      console.log(error);
      toast.error(`There was an error: ${error}`)
    }
  }



  
const isSignIn = type === 'sign-in';

  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center"> 
          <Image src="/logo.svg" alt="logo" height={32} width={38}/>
          <h2 className="text-primary-100">PrepWise</h2>
          

</div> 
<h3 className="text-center font-semibold">Practice job interviews with AI</h3>

     

<FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="W-FULL space-y-6 mt-4 form ">
       {!isSignIn && (
        <FormField
        control={form.control} 
        name="name" 
        label="Name" 
        placeholder="Your Name" />
        )}

        <FormField 
        control={form.control} 
        name="email" 
        label="Email" 
        placeholder="Your email address" 
        type="email"
        />

  
        <FormField
        control={form.control} 
        name="password" 
        label="Password" 
        placeholder="Enter your password"
        type="password" 
        />

        <Button className = "btn" type="submit">{isSignIn ?'Sign in' : 'Create an Account' }</Button>
      </form>
    </FormProvider>

    <p className="text-center">
      {isSignIn ? 'No account yet' : 'Have an account already?'}
      <Link href = {!isSignIn ? '/sign-in' : '/sign-up'} className = "font-bold text-user-primary ml-1"> 
      {!isSignIn ? 'Sign in' : 'Sign up'}  </Link>
    </p>

    </div>
    </div>
    </div>
  )
}

export default AuthForm