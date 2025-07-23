// src/router.tsx or src/routes.tsx
import { createRoute, createRootRoute, createRouter } from '@tanstack/react-router'
import { RootLayout, Landing, Dashboard } from '@/routes'

// Define root route 
const rootRoute = createRootRoute({component: RootLayout})

const landingRoute = createRoute({
  path: '/landing',
  getParentRoute: () => rootRoute,
  component: Landing
})

// nested router 
export const dashboardRoute = createRoute({ 
    path: '/dashboard',
    getParentRoute: () => rootRoute,
    component: Dashboard,
})

//route tree and router
const routeTree = rootRoute.addChildren([landingRoute, dashboardRoute])

export const router = createRouter({ routeTree })

