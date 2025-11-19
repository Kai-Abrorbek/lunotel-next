import { InventoryStatus } from '../../enums/inventory.enum';

export interface InventoryUpdateInput {
	_id: string;
	roomTypeId: string;
	stayPlanId: string;

	inventoryDate?: string;
	inventoryAllotment?: number;
	inventoryPrice?: number;
	inventoryStatus?: InventoryStatus;
}
