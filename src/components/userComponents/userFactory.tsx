import User from "../../models/user";

export default class UserFactory {
  static create(
    name: string,
    email: string,
    password: string | undefined,
    id: number,
    active: boolean = true,
    isAdmin: boolean = false,
    imagePath: string = ""
  ) {
    if (password === "" || password === null) password = undefined;
    return new User(
      id,
      name,
      email,
      password,
      isAdmin,
      new Date(),
      new Date(),
      active,
      imagePath
    );
  }
  static createDefault() {
    return new User(0, "", "", "", false, new Date(), new Date());
  }
}
