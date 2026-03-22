

## Plan: Reativar Autenticacao Completa

Two files need changes:

### 1. `src/components/ProtectedRoute.tsx`
Restore full auth guard: use `useAuth()` to check `loading` and `user` state. Show a loading spinner while checking session. Redirect to `/login` if no user is authenticated.

### 2. `src/App.tsx`
Restore `RootRedirect` to check auth state: if user is logged in, redirect to `/dashboard`; otherwise redirect to `/login`.

No database or Edge Function changes needed. The existing `AuthContext`, `Login`, `Register`, `ForgotPassword`, and `ResetPassword` pages are already fully implemented.

