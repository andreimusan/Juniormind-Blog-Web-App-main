export default class Post {
  id: number;

  title: string;

  content: string;

  author: number;

  dateCreated: string;

  dateModified: string;

  authorName!: string;

  commentsCount!: number;

  image: string;

  constructor(
    id: number,
    title: string,
    content: string,
    author: number,
    dateCreated: string,
    dateModified: string,
    image: string = ""
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.image = image;
  }
}
