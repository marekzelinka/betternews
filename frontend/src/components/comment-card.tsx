import { useState, type Dispatch, type SetStateAction } from "react";
import {
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

import type { Comment } from "@/shared/types";
import { getCommentComments, userQueryOptions } from "@/lib/api";
import { useUpvoteCommentMutation } from "@/lib/api-hooks";
import { cn, relativeTime } from "@/lib/utils";

import { Separator } from "./ui/separator";

export function CommentCard({
  comment,
  depth,
  activeReplyId,
  onReply,
  isLast,
}: {
  comment: Comment;
  depth: number;
  activeReplyId: number | null;
  onReply: Dispatch<SetStateAction<number | null>>;
  isLast: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isUpvoted = comment.commentUpvotes.length > 0;
  const isReplying = activeReplyId === comment.id;

  const queryClient = useQueryClient();

  const userQueryResult = useQuery(userQueryOptions());
  const user = userQueryResult.data;

  const commentCommentsQueryResult = useSuspenseInfiniteQuery({
    queryKey: ["comments", "comment", comment.id],
    queryFn: ({ pageParam }) =>
      getCommentComments(String(comment.id), pageParam),
    initialPageParam: 1,
    staleTime: Infinity,
    initialData: {
      pageParams: [1],
      pages: [
        {
          success: true,
          message: "Comments fetched",
          data: comment.childComments ?? [],
          pagination: {
            page: 1,
            totalPages: Math.ceil(comment.commentCount / 2),
          },
        },
      ],
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });
  const comments = commentCommentsQueryResult.data;
  const shouldRefetchFirstPage =
    comments.pages[0].data.length === 0 && comment.commentCount > 0;

  const upvoteCommentMutation = useUpvoteCommentMutation();

  return (
    <div className={cn(depth > 0 ? "ml-4 border-l border-border pl-4" : "")}>
      <div className="py-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            disabled={!user}
            onClick={() =>
              upvoteCommentMutation.mutate({
                id: String(comment.id),
                postId: comment.postId,
                parentCommentId: comment.parentCommentId,
              })
            }
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              isUpvoted ? "text-primary" : "hover:text-primary",
            )}
          >
            <ChevronUpIcon size={14} />
            {comment.points}
          </button>
          <span>&middot;</span>
          <span className="font-medium text-foreground">
            {comment.author.username}
          </span>
          <span>&middot;</span>
          <span>{relativeTime(comment.createdAt)}</span>
          <span>&middot;</span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-foreground"
          >
            {isCollapsed ? <PlusIcon size={14} /> : <MinusIcon size={14} />}
          </button>
        </div>
        {!isCollapsed ? (
          <div className="mt-2">
            <p className="text-sm">{comment.content}</p>
            {user ? (
              <div className="mt-2 grid gap-2">
                <button
                  onClick={() => onReply(isReplying ? null : comment.id)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <MessageSquareIcon size={12} />
                  Reply
                </button>
                {isReplying ? <div>COMMENT FORM</div> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {!isCollapsed ? (
        <>
          {comments.pages.map((page, index) => {
            const isLastPage = index === comments.pages.length - 1;

            return page.data.map((comment, index) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                depth={depth + 1}
                activeReplyId={activeReplyId}
                onReply={onReply}
                isLast={isLastPage && index === page.data.length - 1}
              />
            ));
          })}
          {commentCommentsQueryResult.hasNextPage || shouldRefetchFirstPage ? (
            <div className="mt-2">
              <button
                disabled={commentCommentsQueryResult.isFetchingNextPage}
                onClick={() => {
                  if (shouldRefetchFirstPage) {
                    queryClient.invalidateQueries({
                      queryKey: ["comments", "comment", comment.id],
                    });
                  } else {
                    commentCommentsQueryResult.fetchNextPage();
                  }
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronDownIcon size={12} />
                {commentCommentsQueryResult.isFetchingNextPage
                  ? "Loading…"
                  : "More replies"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
      {!isLast ? <Separator className="my-2" /> : null}
    </div>
  );
}
