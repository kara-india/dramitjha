import { Metadata } from "next";
import { Activity } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | KrishnaHealth ERP",
  description: "Enterprise Healthcare Management System for Dr. Amit Jha Sports Injury Clinic",
};

export default function LoginPage() {
  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-teal-900 bg-gradient-to-br from-teal-900 via-teal-800 to-blue-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Activity className="mr-2 h-6 w-6 text-teal-300" />
          <span className="font-bold text-xl tracking-tight font-outfit">KrishnaHealth ERP</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Enterprise Healthcare Management for Dr. Amit Jha Sports Injury Clinic. Streamlining patient care, appointments, and billing with precision.&rdquo;
            </p>
            <footer className="text-sm text-teal-200">System v2.0</footer>
          </blockquote>
        </div>
        {/* Decorative medical pattern */}
        <div className="absolute inset-0 z-10 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
      <div className="lg:p-8 flex h-screen lg:h-auto items-center justify-center w-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight font-outfit">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
