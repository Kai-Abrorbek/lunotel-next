import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

export interface CommentInput {
	commentGroup: CommentGroup;
	commentRating: number;
	commentContent: string;
	commentImages?: [string];
	commentRefId: String; // propertyId
	commentTargetId?: String; // roomId
	memberId: String;
}

interface CISearch {
	commentRefId: string;
}

export interface CommentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: string;
	search: CISearch;
}
