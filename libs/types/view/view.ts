import { ViewGroup } from '../../enums/view.enum';

export interface View {
	_id: String;
	viewGroup: ViewGroup;
	viewRefId: String;
	memberId: String;
	createdAt: Date;
	updatedAt: Date;
}
