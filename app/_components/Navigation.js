import Link from "next/link";
import { auth } from "../_lib/auth";
import Image from "next/image";

export default async function Navigation() {
  const session = await auth();
  console.log(session);

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        {session?.user?.image ? (
          <li>
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-2"
            >
              <img
                src={session.user.image}
                width={40}
                alt="avatar"
                height={40}
                referrerPolicy="no-refere "
                className="rounded-full"
              />
              <span>Guest area</span>
            </Link>
          </li>
        ) : (
          <li>
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors "
            >
              Guest area
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
