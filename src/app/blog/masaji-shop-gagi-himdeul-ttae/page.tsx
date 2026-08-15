import { BlogPostPage } from "@/components/BlogPostPage";
import {
  createBlogPostMetadata,
  getBlogPost,
} from "@/data/blog-posts";

const post = getBlogPost("masaji-shop-gagi-himdeul-ttae");

export const metadata = createBlogPostMetadata(post);

export default function MassageShopVisitPostPage() {
  return <BlogPostPage post={post} />;
}
