import React, { useState, useRef, useEffect } from "react";
import CreateNewPost from "./CreateNewPots/CreateNewPost";
import Post from "./Post/Post";
import ModifyPost from "./EditPost/EditPost"
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';

  
  


const DisplayAllPosts = () => {
  const [title, setTitle] = useState("");
  const [body, setContent] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [isCreateNewPost, setIsCreateNewPost] = useState(false);
  const [isModifyPost, setIsModifyPost] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const URL='https://bloggy-api.herokuapp.com/posts';
  const [count, setCount] = useState(false);
  //const [moviesList,setMov]=useState([]);

  const fetchData=()=>{
    axios.get(`${URL}`)
        .then(res => {
          setAllPosts(res.data)
        })
  }
   useEffect(()=>{
     fetchData();
   },[]);
  // Initialize useRef
  const getTitle = useRef();
  const getContent = useRef();

  const savePostTitleToState = event => {
    setTitle(event.target.value);
  };
  const savePostContentToState = event => {
    setContent(event.target.value);
  };
  const toggleCreateNewPost = () => {
    setIsCreateNewPost(!isCreateNewPost);
  };
  const toggleModifyPostComponent = () => {
    setIsModifyPost(!isModifyPost)
  }
  const editPost = id => {
    setEditPostId(id);
    console.log(id)
    toggleModifyPostComponent();
  };
  const deletePost = id => {
    const modifiedPost = allPosts.filter(eachPost => {
      fetch("https://bloggy-api.herokuapp.com/posts/"+id,{
        method:'DELETE',
        header:{'Accept':'application/json',
      'Content-Type':'application/json'}})
      return eachPost.id !== id;
    });
    setAllPosts(modifiedPost);
  };
  const updatePost = (event) => {
    event.preventDefault();
    const updatedPost = allPosts.map(eachPost => {
      if (eachPost.id === editPostId) {
        console.log([eachPost.id, editPostId] )
        fetch("https://bloggy-api.herokuapp.com/posts/"+eachPost.id,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
              title: title || eachPost.title,
              body: body || eachPost.body
            })
        })
        
        return {  
          ...eachPost,
          title: title || eachPost.title,
          body: body || eachPost.body
        }  
      }
      console.log(eachPost)
      return eachPost;
    });
    setAllPosts(updatedPost);
    toggleModifyPostComponent();
  };
  const savePost = event => {
    event.preventDefault();
    const id = Date.now();
    setAllPosts([...allPosts, { title, body, id }]);
    console.log(allPosts);
    setTitle("");
    setContent("");
    getTitle.current.value = "";
    getContent.current.value = "";
    toggleCreateNewPost();
    fetch("https://bloggy-api.herokuapp.com/posts/",{
      method:'POST',
      headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
      },
      body:JSON.stringify({
        title: title,
        body: title,
        id:id
      })
    })
    .then(res=>res.json())
  };
  if (isCreateNewPost) {
    return (
      <>
        <CreateNewPost
          savePostTitleToState={savePostTitleToState}
          savePostContentToState={savePostContentToState}
          getTitle={getTitle}
          getContent={getContent}
          savePost={savePost}
          deletePost={deletePost}
        />
      </>
    );
  }
  else if (isModifyPost) {
    const post = allPosts.find(post => {
      return post.id === editPostId;
    });
    return (
      <ModifyPost
        title={post.title}
        body={post.body}
        updatePost={updatePost}
        savePostTitleToState={savePostTitleToState}
        savePostContentToState={savePostContentToState}
      />
    );
  }
  return (
    
    <>
      {!allPosts.length ? (
        
        <section className="no-post">
          <h1>There are no posts here.</h1>
          <h3> It is necessary to create</h3>
          <br />
      <br />
          <section className="button-wrapper">
      <button  class="btn btn-success" onClick={toggleCreateNewPost} >Create New</button>
      </section>
        </section>
      ) : (
      <div ><h1 className="bg-success text-center">All Posts</h1>
        <section className="all-post">
        <section className="button-wrapper">
          <button onClick={toggleCreateNewPost} class="btn col-12 ml-auto mr-3 btn-success">Create New</button>
        </section>
        {allPosts.map(eachPost => {
          return (
            <Post
              id={eachPost.id}
              key={eachPost.id}
              title={eachPost.title}
              body={eachPost.body}
              editPost={editPost}
              deletePost={deletePost}
            />
          );
        })}
      
        </section>
        
        </div>
      )}

      
    </>
  );
};
export default DisplayAllPosts;