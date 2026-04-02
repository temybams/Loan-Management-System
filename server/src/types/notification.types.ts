
import { NotificationType } from "../constants/notification";

export interface NotificationJob {
  user: {
    id: string;
    email: string;
    phone: string;
    name: string;
  };
  type: NotificationType;
  data: any[];
}