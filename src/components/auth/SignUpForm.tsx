
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Assuming db is exported for Firestore
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  school: z.string().min(2, { message: "School name is required." }),
  grade: z.string().min(1, { message: "Grade is required (e.g., Grade 5)." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, startTransition] = useTransition();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      school: "",
      grade: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Update Firebase Auth profile
        await updateProfile(user, {
          displayName: `${values.name} ${values.surname}`,
        });

        // Store additional user information in Firestore
        // This is the part that requires Firestore permissions
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: values.email,
          name: values.name,
          surname: values.surname,
          school: values.school,
          grade: values.grade,
          createdAt: serverTimestamp(),
          following: [], 
          followersCount: 0, 
          avatarUrl: `https://placehold.co/100x100.png?text=${values.name.charAt(0)}${values.surname.charAt(0)}`, 
        });

        toast({
          title: "Account Created!",
          description: "Welcome! You're now signed up.",
        });
        router.push("/"); 
      } catch (error: any) {
        console.error("Sign up error details:", error);
        let errorMessage = "Failed to create account. Please try again.";
        
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already in use. Please try another or sign in.";
        } else if (error.code === "permission-denied" || 
                   (error.message && 
                    (error.message.toLowerCase().includes("missing or insufficient permissions") || 
                     error.message.toLowerCase().includes("permission-denied"))
                   )
                  ) {
          errorMessage = `Account created in Auth, but FAILED TO SAVE USER DETAILS TO DATABASE due to Firestore permissions. 
                          Please check your Firestore Security Rules. 
                          Ensure the rule 'match /users/{userId} { allow write: if request.auth.uid == userId; }' (or similar) is in place and published. 
                          Firebase Error: ${error.message}`;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: errorMessage,
          duration: 10000, // Increased duration for more complex error
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join Fundanii Ai to start your learning adventure!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of your school" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grade 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Create Account
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" asChild className="px-0">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

    