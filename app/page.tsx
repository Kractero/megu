import { CardForm } from '@/components/CardForm'
import Image from 'next/image'

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
