export default class UserComment {
    id: number;
  
    postID: number;
  
    text: string;
  
    author: number;
  
    dateCreated: Date;
  
    dateModified: Date;
  
    parentID?: number;

    authorName!: string;

    replies!: UserComment[];

    repliesCount!: number;
  
    constructor(
      id: number,
      postID: number,
      text: string,
      author: number,
      dateCreated: Date,
      dateModified: Date,
      parentID?: number
    ) {
      this.id = id;
      this.postID = postID;
      this.text = text;
      this.author = author;
      this.dateCreated = dateCreated;
      this.dateModified = dateModified;
      this.parentID = parentID;
    }
  }
  