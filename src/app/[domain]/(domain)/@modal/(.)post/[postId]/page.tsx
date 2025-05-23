import { PostPageComponent, PostPageHOP, PostPageTitle } from "../../../post/[postId]/PostPageHOP";
import { PostSimpleModal } from "./PostSimpleModal";

const PostModal = PostPageHOP(props => {
  return (
    <PostSimpleModal id="post-modal" title={<PostPageTitle {...props} />} size="large">
      <PostPageComponent {...props} />
    </PostSimpleModal>
  );
});

export default PostModal;
