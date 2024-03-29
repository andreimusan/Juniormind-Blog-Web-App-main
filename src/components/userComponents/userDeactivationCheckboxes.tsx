import { Form } from "react-bootstrap";

type Props = {
  setDeletePostsOption(option: boolean): void;
  setDeleteCommentsOption(option: boolean): void;
};

const UserDeactivationCheckboxes = ({
  setDeletePostsOption,
  setDeleteCommentsOption,
}: Props) => {
  return (
    <Form>
      <Form.Check
        type={"checkbox"}
        id={"deletePosts"}
        label={"Posts"}
        onChange={(e) => setDeletePostsOption(e.target.checked)}
      />

      <Form.Check
        type={"checkbox"}
        id={"deleteComments"}
        label={"Comments"}
        onChange={(e) => setDeleteCommentsOption(e.target.checked)}
      />
    </Form>
  );
};

export default UserDeactivationCheckboxes;
