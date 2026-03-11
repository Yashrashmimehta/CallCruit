import './App.css'
import { SignedIn, SignedOut, UserButton, SignInButton,SignOutButton } from '@clerk/clerk-react'  // ✅
function App() {
  return (
    <>
      <h1>Welcome to CodeCruit</h1>

      <SignedOut>
        <SignInButton mode="modal" >
          <button className="">Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  )
}

export default App