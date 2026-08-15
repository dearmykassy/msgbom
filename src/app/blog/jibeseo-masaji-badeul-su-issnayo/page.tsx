import { BlogPostPage } from "@/components/BlogPostPage";
import {
  createBlogPostMetadata,
  getBlogPost,
} from "@/data/blog-posts";

const post = getBlogPost("jibeseo-masaji-badeul-su-issnayo");

export const metadata = createBlogPostMetadata(post);

export default function HomeMassagePostPage() {
  return <BlogPostPage post={post} />;
}
