# Milestone 1 — Quick Test Checklist

Use this checklist for rapid smoke testing after implementation.

## Pre-Flight
- [ ] Supabase project created
- [ ] `.env.local` configured with correct keys
- [ ] Dev server running

## Critical Path Tests (Must Pass)

### Sign Up
- [ ] Can create new account with valid email/password
- [ ] Shows error for existing email
- [ ] Validates email format
- [ ] Validates password strength

### Login
- [ ] Can login with correct credentials
- [ ] Shows error for wrong password
- [ ] Shows error for non-existent email
- [ ] Redirects to `/app` after successful login

### Route Protection
- [ ] Cannot access `/app` when logged out (redirects to `/login`)
- [ ] Cannot access `/app/projects/[id]` when logged out
- [ ] Can access `/app` when logged in
- [ ] Login page redirects to `/app` if already logged in

### Logout
- [ ] Logout button visible when logged in
- [ ] Clicking logout ends session
- [ ] Redirects to `/login` after logout
- [ ] Cannot access `/app` after logout using back button

### Session Persistence
- [ ] Session persists on page reload
- [ ] Can refresh `/app` without being logged out

## Security Checks
- [ ] Passwords not visible in network requests (HTTPS)
- [ ] Session tokens stored securely
- [ ] No SQL injection possible

## UX Checks
- [ ] Loading states shown during auth actions
- [ ] Error messages are clear and helpful
- [ ] Forms have proper validation feedback
- [ ] Mobile view works correctly

---

**Quick Test Time:** ~10 minutes  
**Full Test Suite:** See `milestone-1-test-cases.md`
