import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { CenteredContainer } from "@/dsfr";
import { DsfrPage } from "@/dsfr/layout/DsfrPage";
import { TrackPageView } from "@/lib/tracking-provider";
import { postViewed } from "@/lib/tracking-provider/trackingPlan";

import { PostPageComponent, PostPageHOP, PostPageTitle } from "./PostPageHOP";

const PostPage = PostPageHOP(props => {
  return (
    <DsfrPage>
      <TrackPageView
        event={postViewed({
          postId: String(props.post.id),
          boardId: String(props.post.board.id),
          tenantId: String(props.post.tenantId),
        })}
      />
      <CenteredContainer className={cx(fr.cx("fr-mt-2w"))}>
        <h1>
          <PostPageTitle {...props} />
        </h1>
        <PostPageComponent {...props} />
      </CenteredContainer>
    </DsfrPage>
  );
});

export default PostPage;
