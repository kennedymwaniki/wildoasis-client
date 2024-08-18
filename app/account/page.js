import { auth } from "../_lib/auth";

export const metadata = {
  title: "Account",
};

export default async function Page() {
  const session = await auth();
  console.log(session);
  const name = session.user.name;
  return (
    <div className="font-semibold text-2xl text-accent-600">
      <h1>Welcome, {name} </h1>
    </div>
  );
}
