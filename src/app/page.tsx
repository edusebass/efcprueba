import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex items-center gap-16 ">
      <div className="h-screen w-1/2">
        <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" alt="" className="w-full h-full"/>
      </div>
      <div className="m-auto h-full">
        <LoginForm />
      </div>
    </main>
  );
}
