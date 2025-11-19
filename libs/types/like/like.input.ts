import { LikeGroup } from '../../enums/like.enum';

export interface LikeInput {
	memberId: String;
	likeRefId: String;
	likeGroup: LikeGroup;
}
