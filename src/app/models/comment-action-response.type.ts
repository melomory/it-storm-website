import { CommentAction } from './comment-action.type';

export interface CommentActionResponse {
  comment: string;
  action: CommentAction;
}
