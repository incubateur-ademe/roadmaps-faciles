import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { CenteredContainer } from "@/dsfr";

import { PostPageComponent, PostPageHOP, PostPageTitle } from "./PostPageHOP";

const PostPage = PostPageHOP(props => {
  return (
    <CenteredContainer className={cx(fr.cx("fr-mt-2w"))}>
      <h1>
        <PostPageTitle {...props} />
      </h1>
      <PostPageComponent {...props} />
    </CenteredContainer>
  );
});

export default PostPage;
