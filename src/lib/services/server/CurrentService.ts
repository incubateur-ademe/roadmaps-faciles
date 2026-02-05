import { type Tenant } from "@/lib/model/Tenant";
import { AppError } from "@/utils/error";
import { type pvoid } from "@/utils/types";

import { type Service } from "../types";

/**
 * Singleton partagé entre les requêtes sur le même worker.
 * En RSC, chaque render-pass est isolé donc c'est safe pour les Server Components.
 * En revanche les Server Actions partagent le module-scope : deux requêtes
 * concurrentes pourraient se marcher dessus sur `_tenant`.
 *
 * TODO long-terme : remplacer par AsyncLocalStorage pour une isolation garantie.
 */
export class CurrentService implements Service {
  private _tenant: null | Tenant = null;
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
