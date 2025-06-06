/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface Comment {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
  };
}
