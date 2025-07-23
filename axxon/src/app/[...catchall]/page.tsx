'use client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router/router'

//this opens up next.js to take in next.js to take in tanstack routing system
export default function CatchAllPage() {
  return <RouterProvider router={router} />
}
