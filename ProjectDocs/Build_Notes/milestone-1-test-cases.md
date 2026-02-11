# Milestone 1 Test Cases — Supabase Connection + Auth

**Objective:** Verify authentication, route protection, and Supabase integration work correctly.

**Test Date:** TBD (after Milestone 1 implementation)

---

## Test Environment Setup

### Prerequisites
- [ ] Supabase project created and configured
- [ ] Environment variables set (`.env.local` file exists)
- [ ] Development server running (`npm run dev`)
- [ ] Browser with dev tools available

### Environment Variables to Verify
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

---

## 1. Supabase Connection Tests

### TC-1.1: Supabase Client Initialization
**Priority:** High  
**Type:** Unit Test

**Steps:**
1. Import Supabase client from utility file
2. Verify client is initialized without errors
3. Check that client has expected methods (auth, from, storage)

**Expected Result:**
- Client initializes successfully
- No console errors
- Client methods are available

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-1.2: Environment Variables Loaded
**Priority:** High  
**Type:** Configuration Test

**Steps:**
1. Check `.env.local` file exists
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is set
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
4. Restart dev server and check variables are accessible

**Expected Result:**
- Environment variables are defined
- No undefined errors in console
- Supabase client connects to correct project

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 2. User Registration Tests

### TC-2.1: Successful Sign Up (Happy Path)
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to `/login` or signup page
2. Fill in email: `test-[timestamp]@example.com`
3. Fill in password: `SecurePass123!`
4. Click "Sign Up" button
5. Check email for confirmation link (if email confirmation enabled)

**Expected Result:**
- User account created in Supabase
- Success message displayed
- User redirected to dashboard OR email confirmation message shown
- No error messages

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.2: Sign Up with Existing Email
**Priority:** High  
**Type:** Negative Test

**Steps:**
1. Navigate to signup page
2. Use an already registered email
3. Enter password
4. Click "Sign Up"

**Expected Result:**
- Error message: "User already registered" or similar
- User remains on signup page
- No redirect occurs

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.3: Sign Up with Invalid Email
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Navigate to signup page
2. Enter invalid email: `notanemail`
3. Enter password
4. Attempt to submit

**Expected Result:**
- Form validation error shown
- Cannot submit form
- Helpful error message displayed

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.4: Sign Up with Weak Password
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Navigate to signup page
2. Enter valid email
3. Enter weak password: `123`
4. Attempt to submit

**Expected Result:**
- Password validation error shown
- Form cannot be submitted
- Error message explains password requirements

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.5: Sign Up with Empty Fields
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Navigate to signup page
2. Leave email and password empty
3. Click "Sign Up"

**Expected Result:**
- Validation errors for both fields
- Form cannot be submitted
- Error messages clearly indicate required fields

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 3. User Login Tests

### TC-3.1: Successful Login (Happy Path)
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Use credentials from TC-2.1 (or existing test account)
2. Navigate to `/login`
3. Enter correct email
4. Enter correct password
5. Click "Login"

**Expected Result:**
- User authenticated successfully
- Redirected to `/app` (dashboard)
- User session established
- Can see personalized content (user name/avatar)

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.2: Login with Incorrect Password
**Priority:** High  
**Type:** Negative Test

**Steps:**
1. Navigate to `/login`
2. Enter valid email
3. Enter incorrect password
4. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials" or similar
- User remains on login page
- No redirect occurs
- No sensitive information leaked in error message

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.3: Login with Non-Existent Email
**Priority:** Medium  
**Type:** Negative Test

**Steps:**
1. Navigate to `/login`
2. Enter email that doesn't exist: `nonexistent@example.com`
3. Enter any password
4. Click "Login"

**Expected Result:**
- Error message (should NOT reveal email doesn't exist for security)
- Generic "Invalid credentials" message
- User remains on login page

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.4: Login with Empty Credentials
**Priority:** Low  
**Type:** Validation Test

**Steps:**
1. Navigate to `/login`
2. Leave both fields empty
3. Click "Login"

**Expected Result:**
- Validation errors displayed
- Form cannot be submitted
- Clear error messages

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 4. Route Protection Tests

### TC-4.1: Access Protected Route While Logged Out
**Priority:** High  
**Type:** Authorization Test

**Steps:**
1. Ensure logged out (clear cookies/storage if needed)
2. Attempt to access `/app` (dashboard)
3. Observe behavior

**Expected Result:**
- Redirected to `/login`
- Cannot access dashboard content
- URL changes to `/login`

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-4.2: Access Protected Project Route While Logged Out
**Priority:** High  
**Type:** Authorization Test

**Steps:**
1. Ensure logged out
2. Attempt to access `/app/projects/[id]`
3. Observe behavior

**Expected Result:**
- Redirected to `/login`
- No project data displayed
- Protected route inaccessible

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-4.3: Access Login Page While Logged In
**Priority:** Medium  
**Type:** Redirect Test

**Steps:**
1. Log in successfully
2. Navigate to `/login`
3. Observe behavior

**Expected Result:**
- Redirected to `/app` (dashboard)
- Cannot stay on login page while authenticated

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-4.4: Direct URL Access After Login
**Priority:** High  
**Type:** Navigation Test

**Steps:**
1. Log in successfully
2. Navigate to `/app/projects/[any-id]` via URL bar
3. Observe behavior

**Expected Result:**
- Can access protected routes
- Page loads correctly
- No redirect to login

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 5. Logout Tests

### TC-5.1: Successful Logout
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Log in first (TC-3.1)
2. Click user avatar/menu
3. Click "Sign out"
4. Observe behavior

**Expected Result:**
- User session terminated
- Redirected to `/login`
- Cannot access `/app` without logging in again
- User data cleared from UI

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-5.2: Logout Clears Session
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Log in
2. Log out (TC-5.1)
3. Use browser back button
4. Attempt to access previous protected pages

**Expected Result:**
- Cannot access protected pages
- Redirected to login
- Session completely cleared
- No cached sensitive data accessible

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-5.3: Multiple Browser Windows Logout
**Priority:** Medium  
**Type:** Session Management Test

**Steps:**
1. Log in
2. Open same app in second browser window/tab
3. Log out in first window
4. Try to interact in second window

**Expected Result:**
- Second window also logged out (or shows logout state on next action)
- Consistent session state across windows

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 6. Session Persistence Tests

### TC-6.1: Session Persists on Page Reload
**Priority:** High  
**Type:** Session Test

**Steps:**
1. Log in successfully
2. Reload the page (F5)
3. Observe behavior

**Expected Result:**
- User remains logged in
- No redirect to login
- User data still displayed
- Dashboard accessible

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-6.2: Session Persists on Browser Restart (if configured)
**Priority:** Medium  
**Type:** Session Test

**Steps:**
1. Log in successfully
2. Close browser completely
3. Reopen browser
4. Navigate to `/app`

**Expected Result:**
- User still logged in (if "Remember me" enabled)
- OR redirected to login (if session-only)
- Behavior matches configuration

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-6.3: Session Expires After Timeout (if configured)
**Priority:** Low  
**Type:** Session Test

**Steps:**
1. Log in
2. Wait for session timeout period (if set)
3. Try to perform an action

**Expected Result:**
- Session expired message shown
- Redirected to login
- Must log in again

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 7. UI/UX Tests

### TC-7.1: Loading States During Auth
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Navigate to login page
2. Submit credentials
3. Observe loading indicators

**Expected Result:**
- Loading spinner or disabled button shown
- User cannot double-submit
- Clear feedback that action is processing

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-7.2: Error Messages Are Clear
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Trigger various auth errors (wrong password, invalid email, etc.)
2. Read error messages

**Expected Result:**
- Error messages are clear and actionable
- No technical jargon or stack traces
- Messages help user fix the issue
- Consistent styling

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-7.3: Success Messages Are Shown
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Successfully sign up
2. Successfully log in
3. Successfully log out

**Expected Result:**
- Success messages or toast notifications shown
- Positive feedback for successful actions
- Messages disappear after appropriate time

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-7.4: Form Validation Is Real-Time
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Navigate to login/signup
2. Start typing invalid email
3. Observe validation feedback

**Expected Result:**
- Validation feedback shown as user types (or on blur)
- Helpful hints provided
- Clear indication of valid/invalid fields

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 8. Security Tests

### TC-8.1: Passwords Not Visible in Network Tab
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Open browser DevTools → Network tab
2. Submit login form
3. Inspect request payload

**Expected Result:**
- Password sent over HTTPS
- Password not visible in plain text in URL
- Secure transmission to Supabase

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-8.2: Session Token Not Exposed
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Log in successfully
2. Open DevTools → Application/Storage → Cookies
3. Inspect stored tokens

**Expected Result:**
- Tokens stored securely (HttpOnly if possible)
- No sensitive data in localStorage visible to scripts
- Follows Supabase security best practices

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-8.3: SQL Injection Attempt
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Navigate to login
2. Enter SQL injection string in email: `' OR '1'='1`
3. Enter any password
4. Submit

**Expected Result:**
- Input sanitized/rejected
- No SQL injection possible
- Error message or normal invalid credentials response

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 9. Edge Cases

### TC-9.1: Network Failure During Login
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Open DevTools → Network tab
2. Set network to "Offline"
3. Attempt to log in

**Expected Result:**
- Clear error message about network issues
- User not stuck in loading state
- Can retry after connection restored

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-9.2: Supabase Service Unavailable
**Priority:** Low  
**Type:** Error Handling Test

**Steps:**
1. Temporarily use invalid Supabase URL (or simulate service down)
2. Attempt to log in

**Expected Result:**
- Graceful error handling
- Clear message about service unavailability
- No app crash

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-9.3: Rapid Login Attempts (Rate Limiting)
**Priority:** Low  
**Type:** Security Test

**Steps:**
1. Attempt to log in 10+ times rapidly with wrong password
2. Observe behavior

**Expected Result:**
- Rate limiting applied (if configured)
- Clear message if account locked temporarily
- OR normal behavior if no rate limiting

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 10. Mobile Responsiveness

### TC-10.1: Login Page on Mobile
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. Open app on mobile device or DevTools mobile view
2. Navigate to login page
3. Fill form and submit

**Expected Result:**
- Login form usable on small screens
- Buttons properly sized for touch
- No horizontal scrolling needed
- Keyboard doesn't hide important elements

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## Test Summary

**Total Test Cases:** 33

### By Priority:
- **High Priority:** 16
- **Medium Priority:** 13
- **Low Priority:** 4

### Expected Results:
- [ ] All High priority tests pass
- [ ] At least 90% of Medium priority tests pass
- [ ] Edge cases handled gracefully

---

## Sign-Off

**Tester:** ___________  
**Date:** ___________  
**Overall Status:** ☐ Pass ☐ Fail ☐ Partially Passing  

**Notes:**
