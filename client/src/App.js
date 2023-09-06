// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// ====================================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import AuthRequired from "./auth/AuthRequiredd";
import Layout from "./pages/Layout";
import Feed from "./pages/Feed";
import PostView from "./pages/PostView";
import Comments from "./pages/comments/Comments";
import Explore from "./pages/explore/Explore";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/explore/Profile";
import FollowerList from "./pages/followerList/FollowerList";
import FollowingList from "./pages/followingList/FollowingList";
import ProfileEdit from "./pages/ProfileEdit";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <AuthProvider> 
        {/* AuthProvider는 유저데이터를 관리. 하위 객체는 유저에 접근 가능 */}
        <Routes>
          <Route path="/" element={
            <AuthRequired>
              <Layout />
              {/* Layout은 인증이 필요한 컴포넌트 */}
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="p/:id"> {/* path를 그룹화 하기위해 트리 구조*/}
              <Route index element={<PostView />} />
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="profiles/:username">
              <Route index element={<Profile />} />
              <Route path="followers" element={<FollowerList />} />
              <Route path="following" element={<FollowingList />} />
            </Route>
            <Route path="accounts/edit" element={<ProfileEdit />} />
          </Route>
          {/* index라우터의 자식라우터들 모두 인증이 필요한 컴포넌트 */}
 
          <Route path="accounts/login" element={<Login />} />
          <Route path="accounts/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
