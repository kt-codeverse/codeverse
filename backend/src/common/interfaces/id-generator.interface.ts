export interface IdGenerator {
  generate(): string | Promise<string>;
}
