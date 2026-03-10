import { TrackPageView } from "@/lib/tracking-provider";
import { postViewed } from "@/lib/tracking-provider/trackingPlan";

import { PostPageComponent, PostPageHOP, PostPageTitle } from "./PostPageHOP";

const PostPage = PostPageHOP(props => {
  return (
    <>
      <TrackPageView
        event={postViewed({
          postId: String(props.post.id),
          boardId: String(props.post.board.id),
          tenantId: String(props.post.tenantId),
        })}
      />
      <div className="mx-auto mt-4 max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1>
          <PostPageTitle {...props} />
        </h1>
        <PostPageComponent {...props} />
      </div>
    </>
  );
});

export default PostPage;
