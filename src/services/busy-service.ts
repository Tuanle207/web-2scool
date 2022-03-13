import { BusyBackdrop } from '../components/BusyBackdrop';

class BusyService {

  private static _instance?: BusyService;

  public static get instance(): BusyService {
    if (!BusyService._instance) {
      BusyService._instance = new BusyService();
    }
    return BusyService._instance
  }
  
  public busy = (busy: boolean) => {
    BusyBackdrop.show(busy);
  };

}

export const busyService = BusyService.instance;