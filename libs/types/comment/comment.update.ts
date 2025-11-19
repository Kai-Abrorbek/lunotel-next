import { CommentStatus } from '../../enums/comment.enum';

export interface CommentUpdate {
	_id: String;
	commentStatus?: CommentStatus;
	commentContent?: string;
}
