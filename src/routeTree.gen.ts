/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PomodoroConfigImport } from './routes/pomodoro-config'
import { Route as PomodoroImport } from './routes/pomodoro'
import { Route as CountdownConfigImport } from './routes/countdown-config'
import { Route as CountdownImport } from './routes/countdown'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const PomodoroConfigRoute = PomodoroConfigImport.update({
  id: '/pomodoro-config',
  path: '/pomodoro-config',
  getParentRoute: () => rootRoute,
} as any)

const PomodoroRoute = PomodoroImport.update({
  id: '/pomodoro',
  path: '/pomodoro',
  getParentRoute: () => rootRoute,
} as any)

const CountdownConfigRoute = CountdownConfigImport.update({
  id: '/countdown-config',
  path: '/countdown-config',
  getParentRoute: () => rootRoute,
} as any)

const CountdownRoute = CountdownImport.update({
  id: '/countdown',
  path: '/countdown',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/countdown': {
      id: '/countdown'
      path: '/countdown'
      fullPath: '/countdown'
      preLoaderRoute: typeof CountdownImport
      parentRoute: typeof rootRoute
    }
    '/countdown-config': {
      id: '/countdown-config'
      path: '/countdown-config'
      fullPath: '/countdown-config'
      preLoaderRoute: typeof CountdownConfigImport
      parentRoute: typeof rootRoute
    }
    '/pomodoro': {
      id: '/pomodoro'
      path: '/pomodoro'
      fullPath: '/pomodoro'
      preLoaderRoute: typeof PomodoroImport
      parentRoute: typeof rootRoute
    }
    '/pomodoro-config': {
      id: '/pomodoro-config'
      path: '/pomodoro-config'
      fullPath: '/pomodoro-config'
      preLoaderRoute: typeof PomodoroConfigImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/countdown': typeof CountdownRoute
  '/countdown-config': typeof CountdownConfigRoute
  '/pomodoro': typeof PomodoroRoute
  '/pomodoro-config': typeof PomodoroConfigRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/countdown': typeof CountdownRoute
  '/countdown-config': typeof CountdownConfigRoute
  '/pomodoro': typeof PomodoroRoute
  '/pomodoro-config': typeof PomodoroConfigRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/countdown': typeof CountdownRoute
  '/countdown-config': typeof CountdownConfigRoute
  '/pomodoro': typeof PomodoroRoute
  '/pomodoro-config': typeof PomodoroConfigRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/countdown'
    | '/countdown-config'
    | '/pomodoro'
    | '/pomodoro-config'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/countdown'
    | '/countdown-config'
    | '/pomodoro'
    | '/pomodoro-config'
  id:
    | '__root__'
    | '/'
    | '/countdown'
    | '/countdown-config'
    | '/pomodoro'
    | '/pomodoro-config'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CountdownRoute: typeof CountdownRoute
  CountdownConfigRoute: typeof CountdownConfigRoute
  PomodoroRoute: typeof PomodoroRoute
  PomodoroConfigRoute: typeof PomodoroConfigRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CountdownRoute: CountdownRoute,
  CountdownConfigRoute: CountdownConfigRoute,
  PomodoroRoute: PomodoroRoute,
  PomodoroConfigRoute: PomodoroConfigRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/countdown",
        "/countdown-config",
        "/pomodoro",
        "/pomodoro-config"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/countdown": {
      "filePath": "countdown.tsx"
    },
    "/countdown-config": {
      "filePath": "countdown-config.tsx"
    },
    "/pomodoro": {
      "filePath": "pomodoro.tsx"
    },
    "/pomodoro-config": {
      "filePath": "pomodoro-config.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
