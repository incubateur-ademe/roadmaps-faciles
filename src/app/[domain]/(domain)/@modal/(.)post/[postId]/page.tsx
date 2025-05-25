import { DsfrPage } from "@/dsfr/layout/DsfrPage";

import { PostPageComponent, PostPageHOP, PostPageTitle } from "../../../post/[postId]/PostPageHOP";
import { PostSimpleModal } from "./PostSimpleModal";

const PostModal = PostPageHOP(props => {
  return (
    <DsfrPage>
      <PostSimpleModal id="post-modal" title={<PostPageTitle {...props} />} size="large">
        <PostPageComponent {...props} />
      </PostSimpleModal>
    </DsfrPage>
  );
});

export default PostModal;
