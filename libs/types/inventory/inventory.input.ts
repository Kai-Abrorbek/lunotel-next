import { InventoryStatus } from '../../enums/inventory.enum';

export interface InventoryInput {
	roomTypeId: string;
	stayPlanId: string;
	inventoryDate: string;
	inventoryAllotment: number;
	inventoryPrice: number;
	inventoryStatus?: InventoryStatus;
}
