import React from "react";
import {
  PostCol,
  PostNavLink,
  CardImageReplacement,
  PostCard,
  PostImagePreview,
} from "../styles/components.styles";
import { Card } from "react-bootstrap";
import Post from "../../models/post";

type Props = {
  post: Post;
};

export default class PostsPreview extends React.Component<Props> {
  render() {
    const { post } = this.props;
    return (
      <PostCol className="d-flex" xs={12} sm={12} md={6} lg={6} xl={4} xxl={4}>
        <PostNavLink to={`/posts/${post.id}`}>
          <PostCard>
            {post.image === "" ? (
              <CardImageReplacement />
            ) : (
              <PostImagePreview
                src={process.env.REACT_APP_IMAGE_URL + post.image}
              />
            )}
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}...</Card.Text>
            </Card.Body>
            <Card.Footer>
              <p className="text-muted card-author">{post.authorName}</p>
              <small className="text-muted">
                posted on{" "}
                {new Date(post.dateCreated).toLocaleDateString("ro-RO")}
              </small>
            </Card.Footer>
          </PostCard>
        </PostNavLink>
      </PostCol>
    );
  }
}
