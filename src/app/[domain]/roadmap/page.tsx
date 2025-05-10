import { DomainPageHOP } from "../DomainPage";

const RoadmapPage = DomainPageHOP({ withSettings: true })(async props => {
  const tenant = props._data.tenant;
  return (
    <div>
      <h1>Roadmap Page</h1>
      <p>This is the roadmap page.</p>
      {tenant.id}
    </div>
  );
});
export default RoadmapPage;
