'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  const [error, setError] = React.useState<string | null>(null)

  const { handleAuthChange } = useUserContext()

  const handleLogin = async (values: FormValues) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Invalid email or password')
      }

      handleAuthChange()
      router.push('/bookings')
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div className="container my-20">
      <div className="border max-w-[450px] mx-auto p-10 rounded-md bg-card">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md my-3">{error}</div>}
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Login</h1>
          <p className="text-muted-foreground text-lg">Login as a customer</p>
        </div>
        <form onSubmit={form.handleSubmit(handleLogin)} className="mt-5 space-y-3">
          <Input type="email" placeholder="Email Address" {...form.register('email')} />
          <Input type="password" placeholder="Password" {...form.register('password')} />

          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
