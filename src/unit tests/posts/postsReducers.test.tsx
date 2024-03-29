import postsReducer, {
  getAllPosts,
  getPost,
  addPost,
  updatePost,
  deletePost
} from "../../components/store/postSlice";
import Post from "../../models/post";

const post1 = new Post(
  1,
  "title 1",
  "content 1",
  1, 
  new Date().toDateString(),
  new Date().toDateString(),
  ""
);

const post2 = new Post(
  2,
  "title 2",
  "content 2",
  1, 
  new Date().toDateString(),
  new Date().toDateString(),
  ""
);

let initialState: {
  posts: Post[];
  postsCount: number;
  currentPost: { post: Post; isUpdated: boolean; };
  getAllPostsStatus: string;
  getAllPostsError: string;
  getPostStatus: string;
  getPostError: string;
  addPostStatus: string;
  addPostError: string;
  updatePostStatus: string;
  updatePostError: string;
  deletePostStatus: string;
  deletePostError: string;
};

jest.mock("../../components/store/store");

describe("getAllPosts", () => {
  test("fulfilled - should return all posts", () => {
    const action = getAllPosts.fulfilled(
      { data: { posts: [post1, post2], count: 2} },
      "fulfilled",
      { search: "", page: 1 }
    );
    const actual = postsReducer(initialState, action);
    expect(actual.getAllPostsStatus).toEqual("success");
    expect(actual.posts).toEqual([post1, post2]);
    expect(actual.postsCount).toEqual(2);
  });

  test("pending - should change status to pending", () => {
    const action = getAllPosts.pending;
    const actual = postsReducer(initialState, action);
    expect(actual.getAllPostsStatus).toEqual("pending");
  });

  test("rejected - should change status to rejected and error to given error", async () => {
    const action = getAllPosts.rejected(
      new Error(),
      "rejected",
      { search: "", page: 1 }
    );
    const actual = postsReducer(initialState, action);
    expect(actual.getAllPostsStatus).toEqual("rejected");
    expect(actual.getAllPostsError).toEqual("Unexpected server error");
  });
});

describe("getPost", () => {
  test("fulfilled - should change status to success", () => {
    const action = getPost.fulfilled(
      { data: post2 },
      "fulfilled",
      2
    );
    const actual = postsReducer(initialState, action);
    expect(actual.getPostStatus).toEqual("success");
  });

  test("pending - should change status to pending", () => {
    const action = getPost.pending;
    const actual = postsReducer(initialState, action);
    expect(actual.getPostStatus).toEqual("pending");
  });

  test("rejected - should change status to rejected and error to given error", () => {
    const action = getPost.rejected(
      new Error(),
      "rejected",
      2
    );
    const actual = postsReducer(initialState, action);
    expect(actual.getPostStatus).toEqual("rejected");
    expect(actual.getPostError).toEqual("Unexpected server error");
  });
});

describe("addPost", () => {
  test("fulfilled - should add the post to posts array and change status to success", () => {
    const newPost = new Post(
      1,
      "new title",
      "new content",
      1,
      new Date().toDateString(),
      new Date().toDateString(),
      ""
    );
    const action = addPost.fulfilled(
      { data: newPost },
      "fulfilled",
      { 
        post: {
          title: "new title",
          content: "new content",
          author: 1
        },
        file: {}
      }
    );

    const actual = postsReducer(initialState, action);
    expect(actual.posts[0]).toEqual(newPost);
    expect(actual.addPostStatus).toEqual("success");
  });

  test("pending - should change status to pending", () => {
    const action = addPost.pending(
      "pending",
      { 
        post: {
          title: "new title",
          content: "new content",
          author: 1
        },
        file: {}
      }
    );

    const actual = postsReducer(initialState, action);
    expect(actual.addPostStatus).toEqual("pending");
  });

  test("rejected - should  change status to rejected and error to given error", () => {
    const action = addPost.rejected(
      new Error(),
      "rejected",
      { 
        post: {
          title: "new title",
          content: "new content",
          author: 1
        },
        file: {}
      }
    );

    const actual = postsReducer(initialState, action);
    expect(actual.addPostStatus).toEqual("rejected");
    expect(actual.addPostError).toEqual("Unexpected server error");
  });
});

describe("updatePost", () => {
  beforeAll(() => {
    initialState = {
      posts: [post1, post2],
      postsCount: 2,
      currentPost: { post: post1, isUpdated: false, },
      getAllPostsStatus: "",
      getAllPostsError: "",
      getPostStatus: "",
      getPostError: "",
      addPostStatus: "",
      addPostError: "",
      updatePostStatus: "",
      updatePostError: "",
      deletePostStatus: "",
      deletePostError: "",
    };
  });

  afterAll(() => {
    initialState = {
      posts: [],
      postsCount: 0,
      currentPost: { post: post1, isUpdated: false, },
      getAllPostsStatus: "",
      getAllPostsError: "",
      getPostStatus: "",
      getPostError: "",
      addPostStatus: "",
      addPostError: "",
      updatePostStatus: "",
      updatePostError: "",
      deletePostStatus: "",
      deletePostError: "",
    };
  });
  
  test("fulfilled - should return updated post", () => {
    const updatedPost = post1;
    updatedPost.title = "updated";
    const action = updatePost.fulfilled(
      { data: { updatedPost } },
      "fulfilled",
      { post: updatedPost, file: {}, deleteImage: false }
    );
    const actual = postsReducer(initialState, action);
    expect(actual.updatePostStatus).toEqual("success");
    expect(actual.posts[0].title).toEqual("updated");
  });

  test("pending - should change the status to pending", () => {
    const updatedPost = post1;
    updatedPost.title = "updated";
    const action = updatePost.pending(
      "pending",
      { post: updatedPost, file: {}, deleteImage: false }
    );

    const actual = postsReducer(initialState, action);
    expect(actual.updatePostStatus).toEqual("pending");
  });

  test("rejected - should  change status to rejected and error to given error", () => {
    const updatedPost = post1;
    updatedPost.title = "updated";
    const action = updatePost.rejected(
      new Error(),
      "rejected",
      { post: updatedPost, file: {}, deleteImage: false }
    );

    const actual = postsReducer(initialState, action);
    expect(actual.updatePostStatus).toEqual("rejected");
    expect(actual.updatePostError).toEqual("Unexpected server error");
  });
});

describe("deletePost", () => {
  beforeAll(() => {
    initialState = {
      posts: [post1, post2],
      postsCount: 2,
      currentPost: { post: post1, isUpdated: false, },
      getAllPostsStatus: "",
      getAllPostsError: "",
      getPostStatus: "",
      getPostError: "",
      addPostStatus: "",
      addPostError: "",
      updatePostStatus: "",
      updatePostError: "",
      deletePostStatus: "",
      deletePostError: "",
    };
  });

  afterAll(() => {
    initialState = {
      posts: [],
      postsCount: 0,
      currentPost: { post: post1, isUpdated: false, },
      getAllPostsStatus: "",
      getAllPostsError: "",
      getPostStatus: "",
      getPostError: "",
      addPostStatus: "",
      addPostError: "",
      updatePostStatus: "",
      updatePostError: "",
      deletePostStatus: "",
      deletePostError: "",
    };
  });

  test("fulfilled - should remove the post with given id", () => {
    const action = deletePost.fulfilled(
      { postId: 1 },
      "fulfilled",
      1
    );
    
    const actual = postsReducer(initialState, action);
    expect(actual.deletePostStatus).toEqual("success");
    expect(actual.posts).toEqual([post2]);
  });

  test("pending - should change the status to pending", () => {
    const action = deletePost.pending(
      "pending",
      1
    );
    
    const actual = postsReducer(initialState, action);
    expect(actual.deletePostStatus).toEqual("pending");
  });

  test("rejected - should  change status to rejected and error to given error", () => {
    const action = deletePost.rejected(
      new Error(),
      "rejected",
      1
    );

    const actual = postsReducer(initialState, action);
    expect(actual.deletePostStatus).toEqual("rejected");
    expect(actual.deletePostError).toEqual("Unexpected server error");
  })
});
