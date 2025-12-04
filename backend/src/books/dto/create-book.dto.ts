export class CreateBookDto {
  title: string;
  authorId: string; // must match Author id
  publishedAt?: Date;
}
