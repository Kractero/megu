import { CardForm } from '@/components/CardForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl font-semibold">
        Market Evaluation Graphs, Utilizing Market Information (necessarily)
      </h2>
      <CardForm />
    </main>
  )
}
