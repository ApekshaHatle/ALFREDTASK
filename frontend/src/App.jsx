import { Navigate, Route,Routes} from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import FlashcardsPage from './pages/flashcards/FlashcardsPage'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'

import { Toaster }  from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const {data:authUser,isLoading} = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.error || "Somerhing went wrong")
        }
        console.log("authUser is here :",data)
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false,
  });

if(isLoading) {
  return (
    <div className='h-screen flex justify-center items-center'>
      <LoadingSpinner size='lg' />
    </div>
  )
}

  return (
    <div className="flex max-w-7xl mx-auto">
      {/*common componenet coz its not wrapped with routes*/}
      {authUser && <Sidebar className="w-100" />}
      <Routes>
        <Route path='/' element={authUser ? <FlashcardsPage/> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" /> }/>
        <Route path='/signup' element={!authUser ?  <SignUpPage/> : <Navigate to="/" /> }/>
        <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to="/login" />}/>
        <Route path='/profile/:username' element={authUser ? <ProfilePage/>  : <Navigate to="/login" />}/>
        <Route path='/doubt-forum' element={authUser ? <HomePage/> : <Navigate to="/login" />}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
