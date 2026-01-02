import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Member, TotalCounter } from '../member/member';
import { RoomType } from '../roomtype/roomtype';

export interface Comment {
	_id: string;
	commentStatus: CommentStatus;
	commentGroup: CommentGroup;
	commentContent: string;
	commentResponse?: string;
	commentImages: string[];
	commentRefId: string;
	commentRating: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
	roomData?: RoomType;
}

export interface Comments {
	list: Comment[];
	metaCounter: TotalCounter[];
}
