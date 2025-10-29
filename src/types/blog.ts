export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  author: string;
  date: string;
  tags: string[];
  content: string;
  image: {
    imageUrl: string;
    imageHint: string;
  };
}
