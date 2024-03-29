import commentsReducer, {
  getComments,
  getReplies,
  addComment,
  updateComment,
  removeComment,
} from "../../components/store/commentSlice";

import Comment from "../../models/comment";

jest.mock("../../components/store/store");

const comment1 = new Comment(
  1,
  10,
  "this is comment #1",
  10,
  new Date(),
  new Date()
);
const comment2 = new Comment(
  2,
  1,
  "this is comment #2",
  1,
  new Date(),
  new Date()
);
const comment3 = new Comment(
  3,
  10,
  "this is comment #3",
  10,
  new Date(),
  new Date()
);
const comment4 = new Comment(
  4,
  10,
  "this is comment #4",
  10,
  new Date(),
  new Date()
);

const comment5 = new Comment(
  5,
  10,
  "this is comment #5",
  10,
  new Date(),
  new Date()
);

const comment6 = new Comment(
  6,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date()
);

const comment7 = new Comment(
  7,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

const comment8 = new Comment(
  8,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

const comment9 = new Comment(
  9,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

const comment10 = new Comment(
  10,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

const comment11 = new Comment(
  11,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

const comment12 = new Comment(
  12,
  10,
  "this is comment #6",
  10,
  new Date(),
  new Date(),
  1
);

describe("getComments reducer", () => {
  const initialState = {
    commentsArray: [] as Comment[],
    primaryCommentsCount: 0,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  };

  test("getComments fulfilled with default page case should update commentsArray and getCommentsStatus accordingly", async () => {
    const action = getComments.fulfilled(
      {
        comments: [comment1, comment2, comment3, comment4, comment5],
        primaryCommentsCount: 6,
      },
      "fulfilled",
      {
        filter: "post",
        filterId: 10,
        previousPageLastCommentIndex: -1,
        limit: 5,
      }
    );

    const reducer = commentsReducer(initialState, action);
    expect(reducer.getCommentsStatus).toEqual("fulfilled");
    expect(reducer.commentsArray).toEqual([
      comment1,
      comment2,
      comment3,
      comment4,
      comment5,
    ]);
    expect(reducer.primaryCommentsCount).toEqual(6);
  });

  test("getComments fulfilled with different page case should update commentsArray and getCommentsStatus accordingly", async () => {
    const action = getComments.fulfilled(
      {
        comments: [comment6],
        primaryCommentsCount: 6,
      },
      "fulfilled",
      {
        filter: "post",
        filterId: 10,
        previousPageLastCommentIndex: 5,
        limit: 1,
      }
    );
    const initialState = {
      commentsArray: [
        comment1,
        comment2,
        comment3,
        comment4,
        comment5,
      ] as Comment[],
      primaryCommentsCount: 6,
      getCommentsStatus: "",
      getCommentsError: "",
      getRepliesStatus: "",
      getRepliesError: "",
      addCommentStatus: "",
      addCommentError: "",
      updateCommentStatus: "",
      updateCommentError: "",
      removeCommentStatus: "",
      removeCommentError: "",
    };
    const reducer = commentsReducer(initialState, action);
    expect(reducer.getCommentsStatus).toEqual("fulfilled");
    expect(reducer.commentsArray).toEqual([
      comment1,
      comment2,
      comment3,
      comment4,
      comment5,
      comment6,
    ]);
    expect(reducer.primaryCommentsCount).toEqual(6);
  });

  test("getComments pending case should update getCommentsStatus accordingly", async () => {
    const action = getComments.pending;
    const reducer = commentsReducer(initialState, action);
    expect(reducer.getCommentsStatus).toEqual("pending");
    expect(reducer.commentsArray).toEqual([]);
    expect(reducer.primaryCommentsCount).toEqual(0);
  });

  test("getComments rejected due to server not responding case should update getCommentsStatus and getCommentsError accordingly", async () => {
    const error = new Error("Unexpected server error");
    const action = getComments.rejected(error, "rejected", {
      filter: "post",
      filterId: 10,
      previousPageLastCommentIndex: -1,
      limit: 5,
    });
    const reducer = commentsReducer(initialState, action);
    expect(reducer.getCommentsStatus).toEqual("failed");
    expect(reducer.getCommentsError).toEqual("Unexpected server error");
    expect(reducer.commentsArray).toEqual([]);
    expect(reducer.primaryCommentsCount).toEqual(0);
  });
});

describe("getReplies reducer", () => {
  afterEach(() => {
    comment1.replies = [];
  });

  const initialState = {
    commentsArray: [
      comment1,
      comment2,
      comment3,
      comment4,
      comment5,
    ] as Comment[],
    primaryCommentsCount: 6,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  };

  test("getReplies fulfilled with default batch case should update commentsArray comments replies and getRepliesStatus accordingly", async () => {
    const action = getReplies.fulfilled(
      {
        comments: [comment7, comment8, comment9, comment10, comment11],
        primaryCommentsCount: 6,
      },
      "fulfilled",
      { parentID: 1, previousPageLastReplyIndex: -1, limit: 5 }
    );

    const reducer = commentsReducer(initialState, action);
    expect(reducer.getRepliesStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies).toEqual([
      comment7,
      comment8,
      comment9,
      comment10,
      comment11,
    ]);
  });

  test("getReplies fulfilled with different batch case should update commentsArray comments replies and getRepliesStatus accordingly", async () => {
    const action = getReplies.fulfilled(
      {
        comments: [comment12],
        primaryCommentsCount: 6,
      },
      "fulfilled",
      { parentID: 1, previousPageLastReplyIndex: 5, limit: 5 }
    );

    comment1.replies = [comment7, comment8, comment9, comment10, comment11];

    const initialState = {
      commentsArray: [
        comment1,
        comment2,
        comment3,
        comment4,
        comment5,
      ] as Comment[],
      primaryCommentsCount: 6,
      getCommentsStatus: "",
      getCommentsError: "",
      getRepliesStatus: "",
      getRepliesError: "",
      addCommentStatus: "",
      addCommentError: "",
      updateCommentStatus: "",
      updateCommentError: "",
      removeCommentStatus: "",
      removeCommentError: "",
    };

    const reducer = commentsReducer(initialState, action);
    expect(reducer.getRepliesStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies).toEqual([
      comment7,
      comment8,
      comment9,
      comment10,
      comment11,
      comment12,
    ]);
  });
});

describe("addComment reducer", () => {
  afterEach(() => {
    comment1.replies = [];
  });
  const initialState = {
    commentsArray: [] as Comment[],
    primaryCommentsCount: 6,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  };

  test("addComment fulfilled with primary comment case should update commentsArray and addCommentStatus accordingly", async () => {
    const action = addComment.fulfilled(
      {
        data: comment1,
      },
      "fulfilled",
      {
        postID: 10,
        text: "This is comment #1",
        author: 10,
        isSearchRequest: false,
        siblingID: 1,
      }
    );

    const reducer = commentsReducer(initialState, action);
    expect(reducer.addCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray).toEqual([comment1]);
  });

  test("addComment fulfilled with reply and not search request case should update commentsArray comment replies and addCommentStatus accordingly", async () => {
    const action = addComment.fulfilled(
      {
        data: comment7,
      },
      "fulfilled",
      {
        postID: 10,
        text: "This is comment #7",
        author: 10,
        isSearchRequest: false,
        siblingID: 7,
        parentID: 1,
      }
    );

    const initialState = {
      commentsArray: [comment1, comment2, comment3] as Comment[],
      primaryCommentsCount: 6,
      getCommentsStatus: "",
      getCommentsError: "",
      getRepliesStatus: "",
      getRepliesError: "",
      addCommentStatus: "",
      addCommentError: "",
      updateCommentStatus: "",
      updateCommentError: "",
      removeCommentStatus: "",
      removeCommentError: "",
    };

    const reducer = commentsReducer(initialState, action);
    expect(reducer.addCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies).toEqual([comment7]);
  });

  test("addComment fulfilled with reply and search request case should update commentsArray and add reply as a primary comment and addCommentStatus accordingly", async () => {
    const action = addComment.fulfilled(
      {
        data: comment7,
      },
      "fulfilled",
      {
        postID: 10,
        text: "This is comment #7",
        author: 10,
        isSearchRequest: true,
        siblingID: 1,
        parentID: 1,
      }
    );

    const initialState = {
      commentsArray: [comment1, comment2, comment3] as Comment[],
      primaryCommentsCount: 6,
      getCommentsStatus: "",
      getCommentsError: "",
      getRepliesStatus: "",
      getRepliesError: "",
      addCommentStatus: "",
      addCommentError: "",
      updateCommentStatus: "",
      updateCommentError: "",
      removeCommentStatus: "",
      removeCommentError: "",
    };

    const reducer = commentsReducer(initialState, action);
    expect(reducer.addCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies).toEqual([]);
    expect(reducer.commentsArray).toEqual([
      comment1,
      comment7,
      comment2,
      comment3,
    ]);
  });
});

describe("updateComment reducer", () => {
  afterAll(() => {
    comment1.replies = [];
  });
  const initialState = {
    commentsArray: [comment1, comment2, comment3] as Comment[],
    primaryCommentsCount: 6,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  };

  test("updateComment fulfilled with primary comment case should update commentsArray comment and updateCommentStatus accordingly", async () => {
    const updatedComment1 = new Comment(
      comment1.id,
      comment1.postID,
      "Updated comment1",
      comment1.author,
      comment1.dateCreated,
      comment1.dateModified
    );
    const action = updateComment.fulfilled(
      {
        data: updatedComment1,
      },
      "fulfilled",
      {
        id: 1,
        text: "Updated comment1",
      }
    );

    const reducer = commentsReducer(initialState, action);
    expect(reducer.updateCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].text).toEqual("Updated comment1");
  });

  test("updateComment fulfilled with reply case should update commentsArray comment and updateCommentStatus accordingly", async () => {
    const updatedComment7 = new Comment(
      comment7.id,
      comment7.postID,
      "Updated comment7",
      comment7.author,
      comment7.dateCreated,
      comment7.dateModified,
      comment7.parentID
    );
    const action = updateComment.fulfilled(
      {
        data: updatedComment7,
      },
      "fulfilled",
      {
        id: 7,
        text: "Updated comment7",
      }
    );
    comment1.replies = [comment7];

    const reducer = commentsReducer(initialState, action);
    expect(reducer.updateCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies[0].text).toEqual(
      "Updated comment7"
    );
  });
});

describe("removeComment reducer", () => {
  const initialState = {
    commentsArray: [comment1, comment2, comment3] as Comment[],
    primaryCommentsCount: 6,
    getCommentsStatus: "",
    getCommentsError: "",
    getRepliesStatus: "",
    getRepliesError: "",
    addCommentStatus: "",
    addCommentError: "",
    updateCommentStatus: "",
    updateCommentError: "",
    removeCommentStatus: "",
    removeCommentError: "",
  };

  test("removeComment fulfilled with primary comment case should update commentsArray and removeCommentStatus accordingly", async () => {
    const action = removeComment.fulfilled(
      {
        id: 2,
      },
      "fulfilled",
      {
        id: 2,
        parentID: undefined,
      }
    );

    const reducer = commentsReducer(initialState, action);
    expect(reducer.removeCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray).toEqual([comment1, comment3]);
  });

  test("removeComment fulfilled with reply case should update commentsArray comment replies and removeCommentStatus accordingly", async () => {
    const action = removeComment.fulfilled(
      {
        id: 7,
        parentID: 1,
      },
      "fulfilled",
      {
        id: 7,
        parentID: 1,
      }
    );

    comment1.replies = [comment7, comment8];

    const reducer = commentsReducer(initialState, action);
    expect(reducer.removeCommentStatus).toEqual("fulfilled");
    expect(reducer.commentsArray[0].replies).toEqual([comment8]);
  });
});
