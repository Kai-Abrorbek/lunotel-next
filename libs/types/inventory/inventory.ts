import { InventoryStatus } from '../../enums/inventory.enum';
import { TotalCounter } from '../member/member';

export interface Inventory {
	_id: String;
	roomTypeId: String;
	stayPlanId: String;
	inventoryDate: string;
	inventoryAllotment: number;
	inventoryPrice?: number;
	inventoryStatus: InventoryStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Inventories {
	list: Inventory[];

	metaCounter: TotalCounter[];
}
