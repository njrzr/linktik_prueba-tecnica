import { CoffeeBeansIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col justify-center items-center bg-white dark:bg-black">
        <div
          className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-12 py-8 sm:py-0">
          <div
            className="relative space-y-4">
            <p className="relative font-bold uppercase text-4xl sm:text-6xl">bienvenidos a</p>
            <p className="relative font-bold uppercase text-4xl sm:text-6xl">coffee shop</p>
          </div>

          <HugeiconsIcon
          size={200}
          icon={CoffeeBeansIcon} />
        </div>
        
        <div className="relative sm:fixed flex justify-center items-center gap-4 bg-white sm:bottom-4 sm:left-4 w-auto h-auto px-2 py-2 sm:px-16 sm:py-6 rounded-lg">
          <Link className="relative text-sm sm:text-base text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/shop">/SHOP</Link>
          <Link className="relative text-sm sm:text-base text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/admin">/ADMIN</Link>
          <Link className="relative text-sm sm:text-base text-white font-semibold bg-green-500 hover:bg-gray-400 px-6 py-2 rounded-lg transition-all duration-300" href="/dashboard">/DASHBOARD</Link>
        </div>
      </main>
    </div>
  );
}
