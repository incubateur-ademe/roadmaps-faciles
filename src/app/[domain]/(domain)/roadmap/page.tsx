import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { DomainPageHOP } from "../DomainPage";

const RoadmapPage = DomainPageHOP({ withSettings: true })(props => {
  const tenant = props._data.tenant;
  return (
    <DsfrPage>
      <div>
        <h1>Roadmap Page</h1>
        <p>This is the roadmap page.</p>
        {tenant.id}
      </div>
    </DsfrPage>
  );
});
export default RoadmapPage;
