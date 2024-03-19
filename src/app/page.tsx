
import LoginForm from "@/components/LoginForm";
import { AuthProvider } from "@/context/AuthContext";
import type { AppProps } from 'next/app';

export default function Home() {
  
  return (
    <AuthProvider>
      <main className="flex items-center gap-16 ">
        <div className="h-screen w-1/2">
          <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" alt="" className="w-full h-full"/>
        </div>
        <div className="m-auto h-full">
          <LoginForm />
        </div>
      </main>
      
    </AuthProvider>
  );
}
