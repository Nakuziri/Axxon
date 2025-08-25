export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

export type findByEmailData = Pick<User, 'email'>;
export type createUserData = Omit<User, 'id'>;
