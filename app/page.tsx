import { CardForm } from "@/components/CardForm";
import Image from "next/image";
import Megu from "../public/Megumin.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24 md:pt-48">
      <h2 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
        Megu
      </h2>
      <Image className="w-36 md:max-w-xs my-4 md:my-10" src={Megu} alt="Hero" />
      <p className="text-xs text-center mt-4">
        (Market Evaluation Graphs Utility)
      </p>
      <CardForm />
    </main>
  );
}
