import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("TOKEN:", token);
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      redirect("/dashboard");
    } catch {
      // Token exists but is invalid — proceed to show landing
    }
  }

  return (
    <>
      <h1 className="text-[50px]">landing!</h1>
      <GoogleLoginButton />
    </>
  );
}
