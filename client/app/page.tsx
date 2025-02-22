import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Heart, Trophy, Menu } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Heart className="h-6 w-6 text-green-500" />
              <span className="hidden font-bold sm:inline-block">FitTrack</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/features">Features</Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/pricing">Pricing</Link>
              <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/about">About</Link>
            </nav>
          </div>
          <Button className="md:hidden" variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
              <Button size="sm">Sign up</Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-500 to-green-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Track Your Fitness Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  Achieve your health goals with our comprehensive fitness tracking tools. Start your journey to a healthier you today!
                </p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BarChart2 className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">Activity Tracking</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-center">Monitor your daily activities and workouts with precision.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Heart className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-bold">Health Metrics</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-center">Keep track of vital health metrics like heart rate and sleep quality.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Trophy className="h-12 w-12 text-yellow-500" />
                <h3 className="text-xl font-bold">Goal Setting</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-center">Set and achieve your fitness goals with our smart goal-setting tools.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">What Our Users Say</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg border">
                <p className="text-zinc-500 dark:text-zinc-400 text-center">"FitTrack has completely transformed my fitness routine. I've never been more motivated!"</p>
                <p className="font-semibold">- Sarah J.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg border">
                <p className="text-zinc-500 dark:text-zinc-400 text-center">"The insights I get from FitTrack have helped me make real progress towards my health goals."</p>
                <p className="font-semibold">- Mike T.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg border">
                <p className="text-zinc-500 dark:text-zinc-400 text-center">"I love how easy it is to track my workouts and see my progress over time. Highly recommended!"</p>
                <p className="font-semibold">- Emily R.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">© 2023 FitTrack. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

