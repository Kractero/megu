import { CardForm } from '@/components/CardForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24 md:pt-48">
      <h2 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
        Megumin
      </h2>
      <p className="text-xs text-center mt-4">(Market Evaluation Graphs, Utilizing Market Information (necessarily))</p>
      <CardForm />
    </main>
  )
}
