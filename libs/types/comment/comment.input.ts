import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

export interface CommentInput {
	commentGroup: CommentGroup;
	commentRating: number;
	commentContent: string;
	commentImages?: [string];
	commentRefId: String;
	commentTargetId: String;
	memberId?: String;
}

interface CISearch {
	commentRefId?: String;
}

export interface CommentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CISearch;
}
