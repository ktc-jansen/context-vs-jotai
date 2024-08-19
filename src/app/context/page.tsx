"use client";

import React, { createContext, useContext, useEffect, useState, Suspense, ReactNode } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostsContext = createContext<Post[]>([]);
const SelectedPostContext = createContext({
  selectedPostId: undefined,
  setSelectedPostId: (_: number) => {},
  selectedPost: undefined,
});

const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts?_delay=2000');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider value={posts}>
      {children}
    </PostsContext.Provider>
  );
};

const SelectedPostProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPostId, setSelectedPostId] = useState<number>();
  const [selectedPost, setSelectedPost] = useState<Post>();

  useEffect(() => {
    if (!selectedPostId) return;
    const fetchPost = async () => {
      const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${selectedPostId}?_delay=2000`);
      setSelectedPost(data);
    };
    fetchPost();
  }, [selectedPostId]);

  return (
    <SelectedPostContext.Provider value={{ selectedPostId, setSelectedPostId, selectedPost }}>
      {children}
    </SelectedPostContext.Provider>
  );
};

const Posts = () => {
  const posts = useContext(PostsContext);
  const { setSelectedPostId } = useContext(SelectedPostContext);

  return (
    <ul className="h-full">
      {posts.map((post) => (
        <li className="m-5" key={post.id}>
          <button className="h-10 px-6 font-semibold rounded-md bg-blue-600" onClick={() => setSelectedPostId(post.id)}>Show</button> {post.title}
        </li>
      ))}
    </ul>
  );
};

const Post = () => {
  const { selectedPost } = useContext(SelectedPostContext);

  if (!selectedPost)
    return <div className="p-5 flex bg-gray-800 h-screen items-center justify-center">Select a post</div>;

  return (
    <div className="p-5 h-screen bg-gray-800">
      <h3 className="h-3 mb-5 font-medium">{selectedPost.title}</h3>
      <p>{selectedPost.body}</p>
    </div>
  );
};

const PostId = () => {
  const { selectedPostId } = useContext(SelectedPostContext);
  return (
    <div className="fixed top-0 right-0 m-5 p-2 bg-gray-950 rounded-full font-bold text-yellow-500">{selectedPostId ?? '*'}</div>
  );
};

const Page = () => {
  return (
    <PostsProvider>
      <SelectedPostProvider>
        <PostId />
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }} className="overflow-y-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <Posts />
            </Suspense>
          </div>
          <div style={{ flex: 1 }}>
            <Suspense fallback={<div className="p-5 flex bg-gray-800 h-screen items-center justify-center">Loading post...</div>}>
              <Post />
            </Suspense>
          </div>
        </div>
      </SelectedPostProvider>
    </PostsProvider>
  );
};

export default Page;