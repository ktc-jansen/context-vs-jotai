"use client";

import { Suspense } from 'react';
import { atom, useAtom } from 'jotai';
import axios from 'axios';

const postsAtom = atom(async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts?_delay=2000');
  return data;
});
const selectedPostIdAtom = atom(null);
const selectedPostAtom = atom(async (get) => {
  const id = get(selectedPostIdAtom);
  if (id === null) return null;
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}?_delay=2000`);
  return data;
});

const Posts = () => {
  const [posts] = useAtom(postsAtom);
  const [, setSelectedPostId] = useAtom(selectedPostIdAtom);
  return (
    <ul className="h-full">
      {posts.map((post: any) => (
        <li className="m-5" key={post.id}>
          <button className="h-10 px-6 font-semibold rounded-md bg-blue-600" onClick={() => setSelectedPostId(post.id)}>Show</button> {post.title}
        </li>
      ))}
    </ul>
  );
};

const Post = () => {
  const [selectedPost] = useAtom(selectedPostAtom);
  if (selectedPost === null)
    return <div className="p-5 flex bg-gray-800 h-screen items-center justify-center">Select a post</div>;

  return (
    <div className="p-5 h-screen bg-gray-800">
      <h3 className="h-3 mb-5 font-medium">{selectedPost.title}</h3>
      <p>{selectedPost.body}</p>
    </div>
  );
};

const PostId = () => {
  const [selectedPostId] = useAtom(selectedPostIdAtom);
  return (
    <div className="fixed top-0 right-0 m-5 p-2 bg-gray-950 rounded-full font-bold text-yellow-500">{selectedPostId ?? '*'}</div>
  );
}

const Page = () => {
  return (
    <div>
      <PostId/>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}} className="overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <Posts/>
          </Suspense>
        </div>
        <div style={{flex: 1}}>
          <Suspense
            fallback={<div className="p-5 flex bg-gray-800 h-screen items-center justify-center">Loading post...</div>}>
            <Post/>
          </Suspense>
        </div>
      </div>
      {/* floating bottom window */}
    </div>
  );
};

export default Page;