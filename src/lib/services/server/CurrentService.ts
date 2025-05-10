import { type Tenant } from "@/lib/model/Tenant";
import { AppError } from "@/utils/error";
import { type pvoid } from "@/utils/types";

import { type Service } from "../types";

export class CurrentService implements Service {
  private _tenant: Tenant | null = null;
  public init(): pvoid {}

  set tenant(tenant: Tenant) {
    this._tenant = tenant;
  }

  get tenant(): Tenant {
    if (!this._tenant) {
      throw new MissingCurrentTenantError("Current tenant is not set");
    }
    return this._tenant;
  }
}

export class CurrentServiceError extends AppError {
  public readonly name: string = "CurrentServiceError";
  constructor(message: string) {
    super(message);
  }
}

export class MissingCurrentTenantError extends CurrentServiceError {
  public readonly name: string = "MissingTenantError";
  constructor(message: string) {
    super(message);
  }
}
