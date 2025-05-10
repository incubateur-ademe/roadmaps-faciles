import { notFound } from "next/navigation";

import { boardRepo } from "@/lib/repo";
import { GetBoardSlug, GetBoardSlugNotFoundError } from "@/useCases/boards/GetBoardSlug";

import BoardPage from "./board/[boardSlug]/page";
import { DomainPageHOP } from "./DomainPage";
import RoadmapPage from "./roadmap/page";

const DomainRootPage = DomainPageHOP({
  withSettings: true,
})(async props => {
  const settings = props._data.settings;

  if (settings?.rootBoardId) {
    const useCase = new GetBoardSlug(boardRepo);
    try {
      const { slug } = await useCase.execute(settings.rootBoardId);
      return BoardPage({
        ...props,
        params: Promise.resolve({
          ...(await props.params),
          boardSlug: slug,
        }),
      });
    } catch (error: unknown) {
      if (error instanceof GetBoardSlugNotFoundError) {
        notFound();
      }
      throw error;
    }
  } else {
    return RoadmapPage({ ...props });
  }
});
export default DomainRootPage;
